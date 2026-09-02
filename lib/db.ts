import { Listing, BarterProposal, TradeOrder, BotSession, SectorCategory, TradeCurrency } from './types';
import { INITIAL_LISTINGS } from './mock-data';

// Initialize Supabase Client if environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: any = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    const { createClient } = require('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase package not initialized:', e);
  }
}

// In-Memory Fallback State (with localStorage sync when in browser)
let memoryListings: Listing[] = [...INITIAL_LISTINGS];
let memoryProposals: BarterProposal[] = [];
let memoryOrders: TradeOrder[] = [];
let memorySessions: Record<string, BotSession> = {};

// Load saved local listings if in browser environment
if (typeof window !== 'undefined') {
  try {
    const savedListings = localStorage.getItem('chiredzi_live_listings');
    if (savedListings) {
      const parsed = JSON.parse(savedListings);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryListings = parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load local listings:', e);
  }
}

const saveLocalListings = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('chiredzi_live_listings', JSON.stringify(memoryListings));
    } catch (e) {
      console.error('Failed to save local listings:', e);
    }
  }
};

export const db = {
  getListings: async (filters?: {
    category?: SectorCategory | 'all';
    location?: string | 'all';
    currency?: TradeCurrency | 'all';
    search?: string;
    barterOnly?: boolean;
    harvestReady?: boolean;
  }): Promise<Listing[]> => {
    // If Supabase is connected, query live database table across ALL users!
    if (supabase) {
      try {
        let query = supabase.from('listings').select('*').order('created_at', { ascending: false });

        if (filters?.category && filters.category !== 'all') {
          query = query.eq('category', filters.category);
        }
        if (filters?.location && filters.location !== 'all') {
          query = query.ilike('location_area', `%${filters.location}%`);
        }
        if (filters?.currency && filters.currency !== 'all') {
          query = query.eq('currency', filters.currency);
        }
        if (filters?.harvestReady) {
          query = query.eq('harvest_ready', true);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            userId: row.user_id,
            user: row.user_data,
            title: row.title,
            description: row.description,
            category: row.category,
            currency: row.currency,
            price: row.price,
            barterTerms: row.barter_terms,
            locationArea: row.location_area,
            imageUrls: row.image_urls || [],
            imageTags: row.image_tags || [],
            conditionGrade: row.condition_grade,
            status: row.status,
            urgent: row.urgent,
            harvestReady: row.harvest_ready,
            openToBarter: row.open_to_barter,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to memory DB:', e);
      }
    }

    // In-memory fallback query
    let result = [...memoryListings];

    if (!filters) return result;

    if (filters.category && filters.category !== 'all') {
      result = result.filter((l) => l.category === filters.category);
    }

    if (filters.location && filters.location !== 'all') {
      result = result.filter((l) =>
        l.locationArea.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.currency && filters.currency !== 'all') {
      result = result.filter((l) => l.currency === filters.currency);
    }

    if (filters.barterOnly) {
      result = result.filter((l) => l.openToBarter || l.currency === 'BARTER');
    }

    if (filters.harvestReady) {
      result = result.filter((l) => l.harvestReady);
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.locationArea.toLowerCase().includes(q) ||
          (l.barterTerms && l.barterTerms.toLowerCase().includes(q)) ||
          (l.imageTags && l.imageTags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getListingById: async (id: string): Promise<Listing | null> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            user: data.user_data,
            title: data.title,
            description: data.description,
            category: data.category,
            currency: data.currency,
            price: data.price,
            barterTerms: data.barter_terms,
            locationArea: data.location_area,
            imageUrls: data.image_urls || [],
            imageTags: data.image_tags || [],
            conditionGrade: data.condition_grade,
            status: data.status,
            urgent: data.urgent,
            harvestReady: data.harvest_ready,
            openToBarter: data.open_to_barter,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      } catch (e) {
        console.warn('Supabase fetch single listing failed:', e);
      }
    }

    const listing = memoryListings.find((l) => l.id === id);
    return listing || null;
  },

  createListing: async (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Promise<Listing> => {
    const newListing: Listing = {
      ...listingData,
      id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If Supabase is connected, insert directly into live database!
    if (supabase) {
      try {
        await supabase.from('listings').insert({
          id: newListing.id,
          user_id: newListing.userId,
          user_data: newListing.user,
          title: newListing.title,
          description: newListing.description,
          category: newListing.category,
          currency: newListing.currency,
          price: newListing.price,
          barter_terms: newListing.barterTerms,
          location_area: newListing.locationArea,
          image_urls: newListing.imageUrls,
          image_tags: newListing.imageTags,
          condition_grade: newListing.conditionGrade,
          status: newListing.status,
          urgent: newListing.urgent,
          harvest_ready: newListing.harvestReady,
          open_to_barter: newListing.openToBarter,
          created_at: newListing.createdAt,
          updated_at: newListing.updatedAt,
        });
      } catch (e) {
        console.warn('Supabase insert listing failed, saved to memory DB:', e);
      }
    }

    memoryListings.unshift(newListing);
    saveLocalListings();
    return newListing;
  },

  createProposal: async (proposal: Omit<BarterProposal, 'id' | 'createdAt' | 'status'>): Promise<BarterProposal> => {
    const newProposal: BarterProposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      try {
        await supabase.from('barter_proposals').insert({
          id: newProposal.id,
          listing_id: newProposal.listingId,
          proposer_name: newProposal.proposerName,
          proposer_phone: newProposal.proposerPhone,
          proposer_location: newProposal.proposerLocation,
          offered_item_title: newProposal.offeredItemTitle,
          offered_description: newProposal.offeredDescription,
          cash_top_up: newProposal.cashTopUp || '0',
          status: newProposal.status,
          created_at: newProposal.createdAt,
        });
      } catch (e) {
        console.warn('Supabase insert proposal failed:', e);
      }
    }

    memoryProposals.unshift(newProposal);
    return newProposal;
  },

  createOrder: async (order: Omit<TradeOrder, 'id' | 'createdAt' | 'status'>): Promise<TradeOrder> => {
    const newOrder: TradeOrder = {
      ...order,
      id: `order-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      try {
        await supabase.from('trade_orders').insert({
          id: newOrder.id,
          listing_id: newOrder.listingId,
          buyer_name: newOrder.buyerName,
          buyer_phone: newOrder.buyerPhone,
          pickup_location: newOrder.pickupLocation,
          currency_choice: newOrder.currencyChoice,
          quantity: newOrder.quantity,
          total_price: newOrder.totalPrice,
          status: newOrder.status,
          notes: newOrder.notes,
          created_at: newOrder.createdAt,
        });
      } catch (e) {
        console.warn('Supabase insert order failed:', e);
      }
    }

    memoryOrders.unshift(newOrder);
    return newOrder;
  },

  getProposalsForListing: async (listingId: string): Promise<BarterProposal[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('barter_proposals')
          .select('*')
          .eq('listing_id', listingId);
        if (!error && data) {
          return data.map((p: any) => ({
            id: p.id,
            listingId: p.listing_id,
            proposerName: p.proposer_name,
            proposerPhone: p.proposer_phone,
            proposerLocation: p.proposer_location,
            offeredItemTitle: p.offered_item_title,
            offeredDescription: p.offered_description,
            cashTopUp: p.cash_top_up,
            status: p.status,
            createdAt: p.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch proposals failed:', e);
      }
    }

    return memoryProposals.filter((p) => p.listingId === listingId);
  },

  getBotSession: async (phoneNumber: string): Promise<BotSession> => {
    if (!memorySessions[phoneNumber]) {
      memorySessions[phoneNumber] = {
        phoneNumber,
        currentStep: 'IDLE',
        draftPayload: {},
        updatedAt: new Date().toISOString(),
      };
    }
    return memorySessions[phoneNumber];
  },

  updateBotSession: async (
    phoneNumber: string,
    currentStep: BotSession['currentStep'],
    draftPayload: BotSession['draftPayload']
  ): Promise<BotSession> => {
    memorySessions[phoneNumber] = {
      phoneNumber,
      currentStep,
      draftPayload,
      updatedAt: new Date().toISOString(),
    };
    return memorySessions[phoneNumber];
  },
};
