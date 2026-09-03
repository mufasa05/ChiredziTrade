export type TradeCurrency = 'USD' | 'ZAR' | 'ZWG' | 'BARTER';

export type ListingStatus = 'active' | 'sold' | 'archived' | 'pending_review';

export type SectorCategory = 
  | 'livestock_agric' 
  | 'industrial_services' 
  | 'transport_logistics' 
  | 'woodwork_construction' 
  | 'retail_hardware';

export type LowveldLocation = 
  | 'Tshovani' 
  | 'Chiredzi Light Industry' 
  | 'Triangle Estate' 
  | 'Hippo Valley' 
  | 'Mkwasine' 
  | 'Buffalo Range' 
  | 'Chipiwa Outgrowers' 
  | 'Malipati' 
  | 'Mwenezi / Rutenga' 
  | 'Chiviga';

export type ConditionGrade = 'New' | 'Used - Good' | 'Used - Fair' | 'Service Showcase';

export interface ListingUser {
  id: string;
  phoneNumber: string;
  fullName: string;
  locationArea: string;
  avatarUrl?: string;
  verifiedArtisan?: boolean;
  rating?: number;
  tradeCount?: number;
}

export interface Listing {
  id: string;
  userId: string;
  user: ListingUser;
  title: string;
  description: string;
  category: SectorCategory;
  currency: TradeCurrency;
  price?: number | null;
  barterTerms?: string | null;
  locationArea: LowveldLocation | string;
  imageUrls: string[];
  imageTags?: string[];
  conditionGrade?: ConditionGrade;
  status: ListingStatus;
  urgent?: boolean;
  harvestReady?: boolean;
  openToBarter?: boolean;
  offerEmbedding?: number[];
  wantEmbedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface BarterMatch {
  matchedListing: Listing;
  matchScore: number; // 0 to 100%
  crossFitDescription: string;
  offerWantedOverlap: string;
}

export interface BarterProposal {
  id: string;
  listingId: string;
  proposerName: string;
  proposerPhone: string;
  proposerLocation: string;
  offeredItemTitle: string;
  offeredDescription: string;
  cashTopUp?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface TradeOrder {
  id: string;
  listingId: string;
  buyerName: string;
  buyerPhone: string;
  pickupLocation: string;
  currencyChoice: TradeCurrency;
  quantity: number;
  totalPrice: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: string;
}

export interface BotSession {
  phoneNumber: string;
  currentStep: 'IDLE' | 'AWAITING_MEDIA' | 'AWAITING_TITLE' | 'AWAITING_PRICE' | 'AWAITING_LOCATION' | 'AWAITING_BARTER_WANT';
  draftPayload: Partial<Listing> & {
    tempWantDescription?: string;
    pendingImageBuffer?: string;
  };
  updatedAt: string;
}

export interface VisionAnalysisResult {
  isValidItem: boolean;
  rejectionReason: string | null;
  suggestedTitle: string;
  category: SectorCategory;
  tags: string[];
  conditionGrade: ConditionGrade;
  confidence: number;
}

export interface TradeReview {
  id: string;
  sellerId: string;
  listingId?: string;
  reviewerName: string;
  reviewerLocation: string;
  rating: number; // 1 to 5
  tradeType: string;
  comment: string;
  createdAt: string;
}

