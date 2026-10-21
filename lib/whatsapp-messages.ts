/**
 * ZimBarter - Standardized WhatsApp Message Formatter
 * Formats high-conversion, professional, beautifully arranged trade messages
 * for Zimbabwean buyers, ranchers, farmers, and artisans.
 */

export interface WhatsAppInquiryParams {
  sellerPhone: string;
  sellerName: string;
  listingTitle: string;
  priceOrTerms: string;
  locationArea: string;
  listingId?: string;
  buyerName?: string;
  buyerPhone?: string;
}

export interface WhatsAppOrderParams {
  sellerPhone: string;
  sellerName: string;
  listingTitle: string;
  orderReference: string;
  quantity: number | string;
  totalPrice: number | string;
  currency: string;
  paymentMethod: string;
  collectionHub: string;
  buyerName: string;
  buyerPhone: string;
  notes?: string;
}

export interface WhatsAppBarterParams {
  sellerPhone: string;
  sellerName: string;
  targetListingTitle: string;
  offeredItemTitle: string;
  offeredDescription?: string;
  cashTopUp?: string;
  proposerName: string;
  proposerPhone: string;
  proposerLocation: string;
  listingId?: string;
}

export interface WhatsAppServiceParams {
  providerPhone: string;
  providerName: string;
  tradeCategory: string;
  locationHub: string;
  requestedService: string;
  inquirerName?: string;
  inquirerPhone?: string;
}

export interface WhatsAppSellerResponseParams {
  buyerPhone: string;
  buyerName: string;
  listingTitle: string;
  orderReference?: string;
  totalPrice?: string | number;
  currency?: string;
  pickupLocation: string;
  sellerName: string;
}

function cleanPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '');
  if (!digits) return '263771234567';
  if (digits.startsWith('0')) {
    return '263' + digits.slice(1);
  }
  if (!digits.startsWith('263') && digits.length <= 10) {
    return '263' + digits;
  }
  return digits;
}

/**
 * 1. Formats an inquiry from a prospective buyer to a seller regarding an active listing.
 */
export function formatListingInquiryUrl(params: WhatsAppInquiryParams): string {
  const phone = cleanPhone(params.sellerPhone);
  const text = [
    `🌿 *ZimBarter Marketplace Inquiry*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👋 Hello *${params.sellerName}*,`,
    ``,
    `I am inquiring about your listing on *ZimBarter*:`,
    `📦 *Item:* ${params.listingTitle}`,
    `💰 *Price / Terms:* ${params.priceOrTerms}`,
    `📍 *Location:* ${params.locationArea}`,
    ``,
    params.buyerName ? `👤 *From:* ${params.buyerName}` : null,
    `❓ *Inquiry:* Is this still available? Can we arrange inspection or handover?`,
    ``,
    params.listingId ? `🔗 *Listing Link:* https://zimbarter.co.zw/listing/${params.listingId}` : null,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🇿🇼 _Sent via ZimBarter Zimbabwe_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * 2. Formats a verified cash buy order message to the seller.
 */
export function formatCashOrderUrl(params: WhatsAppOrderParams): string {
  const phone = cleanPhone(params.sellerPhone);
  const formattedMethod =
    params.paymentMethod === 'ecocash'
      ? 'EcoCash (Instant USSD)'
      : params.paymentMethod === 'cash_handover'
      ? 'Cash on Handover (COD)'
      : params.paymentMethod.toUpperCase();

  const text = [
    `🧾 *ZimBarter Official Buy Order*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👋 Hello *${params.sellerName}*,`,
    ``,
    `A confirmed order has been placed for your listing!`,
    ``,
    `📋 *Order Details:*`,
    `• Reference: *#${params.orderReference}*`,
    `• Item: *${params.listingTitle}* (x${params.quantity})`,
    `• Total: *${params.currency} $${params.totalPrice}*`,
    `• Payment Mode: *${formattedMethod}*`,
    `• Pickup Trade Hub: *${params.collectionHub}*`,
    ``,
    `👤 *Buyer Information:*`,
    `• Name: *${params.buyerName}*`,
    `• WhatsApp: *${params.buyerPhone}*`,
    params.notes ? `• Special Note: "${params.notes}"` : null,
    ``,
    `🤝 I am ready to arrange handover/collection. Please confirm when ready!`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🇿🇼 _Sent via ZimBarter Zimbabwe_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * 3. Formats an asset swap / barter proposal to the seller.
 */
export function formatBarterProposalUrl(params: WhatsAppBarterParams): string {
  const phone = cleanPhone(params.sellerPhone);
  const text = [
    `🔄 *ZimBarter Asset Swap Proposal*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👋 Hello *${params.sellerName}*,`,
    ``,
    `I would like to propose a barter trade for your listing:`,
    `🎯 *Your Item:* *${params.targetListingTitle}*`,
    ``,
    `🎁 *What I Am Offering in Exchange:*`,
    `• Asset/Service: *${params.offeredItemTitle}*`,
    params.offeredDescription ? `• Details: "${params.offeredDescription}"` : null,
    params.cashTopUp ? `• Cash Top-Up: *+${params.cashTopUp}*` : null,
    ``,
    `👤 *Proposer Details:*`,
    `• Name: *${params.proposerName}*`,
    `• Location: *${params.proposerLocation}*`,
    `• WhatsApp: *${params.proposerPhone}*`,
    ``,
    `🤝 Let's discuss terms and see if we can close this barter trade!`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🇿🇼 _Sent via ZimBarter Zimbabwe_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * 4. Formats an inquiry to a verified artisan or service provider.
 */
export function formatServiceInquiryUrl(params: WhatsAppServiceParams): string {
  const phone = cleanPhone(params.providerPhone);
  const text = [
    `🛠️ *ZimBarter Artisan Service Request*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👋 Hello *${params.providerName}*,`,
    ``,
    `I found your profile on the *ZimBarter Service Providers Catalog*:`,
    `🔧 *Specialty:* ${params.tradeCategory}`,
    `📍 *Coverage Area:* ${params.locationHub}`,
    ``,
    `💼 *Service Required:*`,
    `"${params.requestedService}"`,
    ``,
    params.inquirerName ? `👤 *Customer Name:* ${params.inquirerName}` : null,
    `❓ Please let me know your availability and estimated quote.`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🇿🇼 _Sent via ZimBarter Zimbabwe_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * 5. Formats seller communication back to the buyer regarding order pickup.
 */
export function formatSellerOrderResponseUrl(params: WhatsAppSellerResponseParams): string {
  const phone = cleanPhone(params.buyerPhone);
  const text = [
    `📦 *ZimBarter Order Handover Update*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👋 Hello *${params.buyerName}*,`,
    ``,
    `This is *${params.sellerName}* from *ZimBarter*.`,
    `I received your order for *"${params.listingTitle}"*${params.orderReference ? ` (Ref: #${params.orderReference})` : ''}.`,
    ``,
    params.totalPrice ? `💰 *Amount Due:* ${params.currency || 'USD'} $${params.totalPrice}` : null,
    `📍 *Agreed Pickup Hub:* ${params.pickupLocation}`,
    ``,
    `🤝 I have prepared your item. When would you like to arrange the pickup / inspection?`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `🇿🇼 _Sent via ZimBarter Zimbabwe_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
