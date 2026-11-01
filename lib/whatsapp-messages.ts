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

export interface WhatsAppBarterResponseParams {
  proposerPhone: string;
  proposerName: string;
  targetListingTitle: string;
  offeredItemTitle: string;
  sellerName: string;
  status?: 'accepted' | 'declined' | 'counter';
  notes?: string;
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
  if (!digits) return '263783237918';
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
    `*ZIMBARTER TRADE NETWORK | OFFICIAL INQUIRY*`,
    `────────────────────────────────────────`,
    `To: *${params.sellerName}*`,
    params.buyerName ? `From: *${params.buyerName}*` : null,
    ``,
    `*Listing Details:*`,
    `• Item: *${params.listingTitle}*`,
    `• Listed Price / Terms: *${params.priceOrTerms}*`,
    `• Trade Hub / Location: *${params.locationArea}*`,
    ``,
    `*Inquiry:*`,
    `Good day. I am inquiring about this listing on ZimBarter. Is it currently available for physical inspection and handover?`,
    ``,
    params.listingId ? `*Listing Reference:* https://chiredzi-trade.vercel.app/listing/${params.listingId}` : null,
    `────────────────────────────────────────`,
    `_ZimBarter Trade Protection & Escrow Desk | Hotline: +263 78 323 7918_`,
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
    `*ZIMBARTER TRADE NETWORK | CONFIRMED BUY ORDER*`,
    `────────────────────────────────────────`,
    `Order Reference: *#${params.orderReference}*`,
    `Status: *CONFIRMED / PENDING HANDOVER*`,
    ``,
    `*Order Details:*`,
    `• Item: *${params.listingTitle}* (Qty: ${params.quantity})`,
    `• Total Settlement: *${params.currency} $${params.totalPrice}*`,
    `• Payment Mode: *${formattedMethod}*`,
    `• Collection Trade Hub: *${params.collectionHub}*`,
    ``,
    `*Counterparty Contact:*`,
    `• Buyer Name: *${params.buyerName}*`,
    `• WhatsApp Contact: *${params.buyerPhone}*`,
    params.notes ? `• Special Instructions: "${params.notes}"` : null,
    ``,
    `*Handover Notice:*`,
    `Please prepare the items for inspection and collection at the agreed trade hub. Escrow release occurs upon mutual verification.`,
    `────────────────────────────────────────`,
    `_ZimBarter Trade Protection & Escrow Desk | Hotline: +263 78 323 7918_`,
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
    `*ZIMBARTER TRADE NETWORK | ASSET SWAP PROPOSAL*`,
    `────────────────────────────────────────`,
    `To: *${params.sellerName}*`,
    `Target Listing: *${params.targetListingTitle}*`,
    ``,
    `*Offered in Exchange:*`,
    `• Asset / Commodity: *${params.offeredItemTitle}*`,
    params.offeredDescription ? `• Specification: "${params.offeredDescription}"` : null,
    params.cashTopUp ? `• Cash Top-Up Offer: *+${params.cashTopUp}*` : null,
    ``,
    `*Proposer Profile:*`,
    `• Name: *${params.proposerName}*`,
    `• Trade Hub: *${params.proposerLocation}*`,
    `• WhatsApp: *${params.proposerPhone}*`,
    ``,
    `*Next Step:*`,
    `Please review the swap proposal and reply to accept, negotiate, or arrange trade hub inspection.`,
    `────────────────────────────────────────`,
    `_ZimBarter Trade Protection & Escrow Desk | Hotline: +263 78 323 7918_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * 3b. Formats seller communication back to the proposer regarding a barter trade offer.
 */
export function formatBarterResponseUrl(params: WhatsAppBarterResponseParams): string {
  const phone = cleanPhone(params.proposerPhone);
  const statusLabel =
    params.status === 'accepted'
      ? 'ACCEPTED - READY FOR TRADE HUB INSPECTION'
      : params.status === 'declined'
      ? 'DECLINED AT THIS TIME'
      : 'COUNTEROFFER PROPOSED';

  const text = [
    `*ZIMBARTER TRADE NETWORK | BARTER PROPOSAL STATUS*`,
    `────────────────────────────────────────`,
    `To: *${params.proposerName}*`,
    `Target Listing: *${params.targetListingTitle}*`,
    `Your Offer: *${params.offeredItemTitle}*`,
    ``,
    `*Seller Decision:* [${statusLabel}]`,
    params.notes ? `*Seller Note:* "${params.notes}"` : null,
    ``,
    `*Verified Seller:*`,
    `• Name: *${params.sellerName}*`,
    ``,
    `Let's coordinate on terms or schedule the physical inspection at the collection hub.`,
    `────────────────────────────────────────`,
    `_ZimBarter Trade Protection & Escrow Desk | Hotline: +263 78 323 7918_`,
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
    `*ZIMBARTER TRADE NETWORK | ARTISAN SERVICE DISPATCH*`,
    `────────────────────────────────────────`,
    `Artisan: *${params.providerName}*`,
    `Specialty: *${params.tradeCategory}*`,
    `Coverage Area: *${params.locationHub}*`,
    ``,
    `*Requested Service:*`,
    `"${params.requestedService}"`,
    ``,
    params.inquirerName ? `*Inquirer Name:* *${params.inquirerName}*` : null,
    `Please respond with your current availability and formal quotation.`,
    `────────────────────────────────────────`,
    `_ZimBarter Artisan & Trades Catalog_`,
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
    `*ZIMBARTER TRADE NETWORK | ORDER HANDOVER UPDATE*`,
    `────────────────────────────────────────`,
    `To: *${params.buyerName}*`,
    `From: *${params.sellerName}*`,
    `Listing: *${params.listingTitle}*${params.orderReference ? ` (Ref: #${params.orderReference})` : ''}`,
    ``,
    params.totalPrice ? `• Total Payable: *${params.currency || 'USD'} $${params.totalPrice}*` : null,
    `• Designated Collection Hub: *${params.pickupLocation}*`,
    ``,
    `*Handover Status:*`,
    `Your order has been prepared and is ready for handover and physical inspection. When would you like to meet at the trade hub?`,
    `────────────────────────────────────────`,
    `_ZimBarter Trade Protection & Escrow Desk | Hotline: +263 78 323 7918_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
