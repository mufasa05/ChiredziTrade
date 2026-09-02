import { Listing, BarterProposal, TradeOrder, BotSession, SectorCategory, TradeCurrency } from './types';
import { INITIAL_LISTINGS } from './mock-data';

let memoryListings: Listing[] = [...INITIAL_LISTINGS];
let memoryProposals: BarterProposal[] = [];
let memoryOrders: TradeOrder[] = [];
let memorySessions: Record<string, BotSession> = {};

export const db = {
  getListings: async (filters?: {
    category?: SectorCategory | 'all';
    location?: string | 'all';
    currency?: TradeCurrency | 'all';
    search?: string;
    barterOnly?: boolean;
    harvestReady?: boolean;
  }): Promise<Listing[]> => {
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

    memoryListings.unshift(newListing);
    return newListing;
  },

  createProposal: async (proposal: Omit<BarterProposal, 'id' | 'createdAt' | 'status'>): Promise<BarterProposal> => {
    const newProposal: BarterProposal = {
      ...proposal,
      id: `prop-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
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
    memoryOrders.unshift(newOrder);
    return newOrder;
  },

  getProposalsForListing: async (listingId: string): Promise<BarterProposal[]> => {
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
