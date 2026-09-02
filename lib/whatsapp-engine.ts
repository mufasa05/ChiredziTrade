import { db } from './db';
import { autoClassifyTextCategory } from './gemini-service';
import { Listing, TradeCurrency } from './types';

export interface WhatsAppInboundMessage {
  from: string; // phone number e.g. "263772849102"
  body?: string;
  type?: 'text' | 'image' | 'interactive';
  imageUrl?: string;
  senderName?: string;
}

export interface WhatsAppOutboundResponse {
  to: string;
  text: string;
  createdListingId?: string;
  quickReplies?: string[];
}

export async function processWhatsAppMessage(msg: WhatsAppInboundMessage): Promise<WhatsAppOutboundResponse> {
  const sender = msg.from.replace(/\D/g, '');
  const rawText = (msg.body || '').trim();
  const session = await db.getBotSession(sender);
  const step = session.currentStep;
  const draft = session.draftPayload || {};

  // Global command overrides
  const upper = rawText.toUpperCase();
  if (upper === 'SELL' || upper === 'POST' || upper === 'TENGESA') {
    await db.updateBotSession(sender, 'AWAITING_TITLE', {});
    return {
      to: sender,
      text: `ChiredziTrade Seller Desk\n\nWhat service or good are you offering?\n\nExamples:\n- Borehole pump repair in Tshovani\n- 4 Brahman heifers\n- Welding sliding gates`,
    };
  }

  if (upper === 'SEARCH' || upper === 'TSVAGA' || upper === 'BUY') {
    await db.updateBotSession(sender, 'IDLE', {});
    return {
      to: sender,
      text: `Search ChiredziTrade\n\nType what you need in English or Shona.\n\nExamples:\n- Need 30t cane truck to Triangle\n- Nditsvagirewo welder`,
    };
  }

  if (upper === 'HELP' || upper === 'MENU' || upper === 'HI' || upper === 'HELLO' || upper === 'MASIKATI') {
    await db.updateBotSession(sender, 'IDLE', {});
    return {
      to: sender,
      text: `Welcome to ChiredziTrade\nLowveld Multi-Currency and Barter Marketplace\n\nHow can we help you today?\n\n1. Reply SELL to list goods, livestock, or artisan services.\n2. Reply with what you need to SEARCH (e.g. Need tractor hire in Mkwasine).\n3. Open web catalog: https://chiredzitrade.co.zw`,
      quickReplies: ['SELL', 'Search Cane Haulage', 'Browse Cattle', 'Find Welder'],
    };
  }

  // FSM Steps for Listing Creation
  switch (step) {
    case 'AWAITING_TITLE': {
      if (!rawText) {
        return {
          to: sender,
          text: `Please type a short title describing what you are selling or offering.`,
        };
      }
      draft.title = rawText;
      draft.category = autoClassifyTextCategory(rawText);
      await db.updateBotSession(sender, 'AWAITING_PRICE', draft);
      return {
        to: sender,
        text: `Price, Currency or Barter Terms\n\nState your price and currency, or describe barter trade terms.\n\nExamples:\n- 650 USD\n- 1200 ZAR\n- Barter: Exchange for 5 bags maize or borehole repair`,
      };
    }

    case 'AWAITING_PRICE': {
      const lower = rawText.toLowerCase();
      const isBarter = lower.includes('barter') || lower.includes('trade') || lower.includes('exchange') || lower.includes('swap');

      if (isBarter) {
        draft.currency = 'BARTER' as TradeCurrency;
        draft.price = null;
        draft.barterTerms = rawText;
        draft.openToBarter = true;
      } else {
        const parts = rawText.split(/\s+/);
        const numeric = parseFloat(parts[0].replace(/[^\d.]/g, '')) || 0;
        let curr: TradeCurrency = 'USD';
        if (lower.includes('zar') || lower.includes('rand') || lower.startsWith('r')) curr = 'ZAR';
        else if (lower.includes('zwg') || lower.includes('zig')) curr = 'ZWG';

        draft.price = numeric;
        draft.currency = curr;
        draft.barterTerms = lower.includes('or') ? rawText : null;
        draft.openToBarter = !!draft.barterTerms;
      }

      await db.updateBotSession(sender, 'AWAITING_LOCATION', draft);
      return {
        to: sender,
        text: `Location in the Lowveld\n\nWhere are you located?\nExamples: Tshovani, Triangle Estate, Chiredzi Light Industry, Mkwasine, Hippo Valley, Malipati`,
      };
    }

    case 'AWAITING_LOCATION': {
      draft.locationArea = rawText || 'Tshovani';

      let defaultPhoto = 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80';
      if (draft.category === 'livestock_agric') {
        defaultPhoto = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&auto=format&fit=crop&q=80';
      } else if (draft.category === 'transport_logistics') {
        defaultPhoto = 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&auto=format&fit=crop&q=80';
      } else if (draft.category === 'woodwork_construction') {
        defaultPhoto = 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&auto=format&fit=crop&q=80';
      }

      const newListing = await db.createListing({
        userId: `user-wa-${sender.slice(-4)}`,
        user: {
          id: `user-wa-${sender.slice(-4)}`,
          phoneNumber: `+${sender}`,
          fullName: msg.senderName || `Trader +${sender.slice(0, 6)}...`,
          locationArea: draft.locationArea,
          verifiedArtisan: true,
          tradeCount: 1,
        },
        title: draft.title || 'Marketplace Item',
        description: `Listed via WhatsApp. Available in ${draft.locationArea}. Contact seller directly for inquiries.`,
        category: draft.category || 'retail_hardware',
        currency: draft.currency || 'USD',
        price: draft.price,
        barterTerms: draft.barterTerms,
        locationArea: draft.locationArea,
        imageUrls: draft.imageUrls && draft.imageUrls.length > 0 ? draft.imageUrls : [defaultPhoto],
        imageTags: [draft.category || 'trade', draft.locationArea.toLowerCase()],
        conditionGrade: 'Service Showcase',
        status: 'active',
        urgent: false,
        harvestReady: draft.category === 'livestock_agric' || draft.category === 'transport_logistics',
        openToBarter: draft.openToBarter || false,
      });

      await db.updateBotSession(sender, 'IDLE', {});

      const priceDisplay =
        newListing.currency === 'BARTER'
          ? `Barter: ${newListing.barterTerms}`
          : `${newListing.price} ${newListing.currency}${newListing.barterTerms ? ` (or ${newListing.barterTerms})` : ''}`;

      return {
        to: sender,
        createdListingId: newListing.id,
        text: `Listing is Live on ChiredziTrade!\n\nTitle: ${newListing.title}\nPrice: ${priceDisplay}\nLocation: ${newListing.locationArea}\nSector: ${newListing.category}\n\nShare your listing link:\nhttps://chiredzitrade.co.zw/listing/${newListing.id}\n\nType SELL to post another item, or type your search query anytime.`,
      };
    }

    // Natural Language Search Fallback
    default: {
      const searchResults = await db.getListings({ search: rawText });
      if (searchResults.length > 0) {
        const top3 = searchResults.slice(0, 3);
        let reply = `Top Matches Found for "${rawText}":\n\n`;
        top3.forEach((item, idx) => {
          const cost =
            item.currency === 'BARTER'
              ? `Barter: ${item.barterTerms}`
              : `${item.price} ${item.currency}`;
          reply += `${idx + 1}. ${item.title}\n   Location: ${item.locationArea} | Price: ${cost}\n   Contact: wa.me/${item.user.phoneNumber.replace(/\D/g, '')}\n\n`;
        });
        reply += `View all at https://chiredzitrade.co.zw?q=${encodeURIComponent(rawText)}`;
        return {
          to: sender,
          text: reply,
        };
      }

      return {
        to: sender,
        text: `ChiredziTrade Bot\n\nWe could not find exact matches for "${rawText}".\n\n1. Type SELL to post an item or artisan service.\n2. Type SEARCH to find tractors, cattle, welders, or haulage.\n3. Browse web catalog: https://chiredzitrade.co.zw`,
      };
    }
  }
}
