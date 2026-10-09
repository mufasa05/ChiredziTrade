import { Listing, BarterProposal, TradeOrder, BotSession, SectorCategory, TradeCurrency, TradeReview } from './types';
import { INITIAL_LISTINGS } from './mock-data';
import { uploadListingImage } from './storage';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
let memoryListings: Listing[] = [];
let memoryProposals: BarterProposal[] = [];
let memoryOrders: TradeOrder[] = [];
let memoryReviews: TradeReview[] = [];
let memorySessions: Record<string, BotSession> = {};

// Load saved local listings if in browser environment & purge legacy mock data
if (typeof window !== 'undefined') {
  try {
    const savedListings = localStorage.getItem('zimbarter_live_listings');
    if (savedListings) {
      const parsed = JSON.parse(savedListings);
      if (Array.isArray(parsed)) {
        // Discard any legacy mock items
        const realOnly = parsed.filter(
          (l) => l && l.id && !l.id.startsWith('listing-00') && !l.id.startsWith('mock-')
        );
        memoryListings = realOnly;
        localStorage.setItem('zimbarter_live_listings', JSON.stringify(realOnly));
      }
    }
  } catch (e) {
    console.error('Failed to load local listings:', e);
  }
}

const saveLocalListings = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('zimbarter_live_listings', JSON.stringify(memoryListings));
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
        if (!error && Array.isArray(data)) {
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
    // Process imageUrls to upload any raw base64 data to Supabase Storage CDN
    const processedImageUrls = await Promise.all(
      (listingData.imageUrls || []).map((url) => uploadListingImage(url))
    );

    const newListing: Listing = {
      ...listingData,
      imageUrls: processedImageUrls,
      id: `listing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If Supabase is connected, insert directly into live database!
    if (supabase) {
      try {
        let targetUserId = newListing.userId;
        const phone = newListing.user.phoneNumber?.trim();

        if (phone) {
          // Check if user already exists with this phone number to avoid unique constraint error
          const cleanDigits = phone.replace(/\D/g, '');
          const { data: existingUser } = await supabase
            .from('users')
            .select('id, phone_number')
            .or(`phone_number.eq."${phone}",phone_number.ilike."%${cleanDigits.slice(-9)}%"`)
            .limit(1)
            .maybeSingle();

          if (existingUser && existingUser.id) {
            targetUserId = existingUser.id;
          } else {
            // Check if user ID exists
            const { data: existingById } = await supabase
              .from('users')
              .select('id')
              .eq('id', targetUserId)
              .maybeSingle();

            if (!existingById) {
              await supabase.from('users').insert({
                id: targetUserId,
                phone_number: phone,
                full_name: newListing.user.fullName || 'Lowveld Trader',
                location_area: newListing.user.locationArea || 'Chiredzi Town',
                avatar_url: newListing.user.avatarUrl || null,
                verified_artisan: newListing.user.verifiedArtisan ?? true,
                rating: newListing.user.rating ?? 5.0,
                trade_count: newListing.user.tradeCount ?? 1,
              });
            }
          }
        }

        // Now insert listing into public.listings
        const { error: insertError } = await supabase.from('listings').insert({
          id: newListing.id,
          user_id: targetUserId,
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

        if (insertError) {
          console.error('Supabase insert listing error, retrying with fallback user:', insertError);
          await supabase.from('listings').insert({
            id: newListing.id,
            user_id: 'user-1788419918428',
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
        }
      } catch (e) {
        console.warn('Supabase insert listing caught error, saved to memory DB:', e);
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
        const numericTopUp = parseFloat(String(newProposal.cashTopUp || '').replace(/[^0-9.]/g, '')) || 0;
        const { error } = await supabase.from('barter_proposals').insert({
          id: newProposal.id,
          listing_id: newProposal.listingId,
          proposer_id: newProposal.proposerId || null,
          proposer_name: newProposal.proposerName,
          proposer_phone: newProposal.proposerPhone,
          offered_item_title: newProposal.offeredItemTitle,
          offered_item_description: newProposal.offeredDescription || '',
          cash_top_up: numericTopUp,
          status: newProposal.status,
          notes: newProposal.proposerLocation || '',
          created_at: newProposal.createdAt,
        });

        if (error) {
          console.error('Supabase insert proposal error:', error);
        }
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
        const formattedNotes = [
          newOrder.pickupLocation ? `Pickup Hub: ${newOrder.pickupLocation}` : '',
          newOrder.notes ? `Buyer Notes: ${newOrder.notes}` : '',
        ].filter(Boolean).join(' | ');

        const { error } = await supabase.from('trade_orders').insert({
          id: newOrder.id,
          listing_id: newOrder.listingId,
          buyer_name: newOrder.buyerName,
          buyer_phone: newOrder.buyerPhone,
          quantity: newOrder.quantity || 1,
          agreed_price: newOrder.totalPrice || 0,
          currency: newOrder.currencyChoice || 'USD',
          status: newOrder.status,
          payment_method: 'CASH_ON_DELIVERY',
          notes: formattedNotes,
          created_at: newOrder.createdAt,
        });

        if (error) {
          console.error('Supabase insert order error:', error);
        }
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
            proposerLocation: p.notes || 'Chiredzi',
            offeredItemTitle: p.offered_item_title,
            offeredDescription: p.offered_item_description,
            cashTopUp: p.cash_top_up ? `$${p.cash_top_up} USD` : undefined,
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

  // Update listing status (e.g. 'sold', 'archived', 'active')
  updateListingStatus: async (listingId: string, status: Listing['status']): Promise<Listing | null> => {
    if (supabase) {
      try {
        await supabase
          .from('listings')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', listingId);
      } catch (e) {
        console.warn('Supabase update listing status failed:', e);
      }
    }

    const idx = memoryListings.findIndex((l) => l.id === listingId);
    if (idx !== -1) {
      memoryListings[idx].status = status;
      memoryListings[idx].updatedAt = new Date().toISOString();
      saveLocalListings();
      return memoryListings[idx];
    }
    return null;
  },

  // Get all proposals for a list of listing IDs belonging to a seller
  getProposalsForSeller: async (listingIds: string[]): Promise<BarterProposal[]> => {
    if (listingIds.length === 0) return [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('barter_proposals')
          .select('*')
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((p: any) => ({
            id: p.id,
            listingId: p.listing_id,
            proposerName: p.proposer_name,
            proposerPhone: p.proposer_phone,
            proposerLocation: p.notes || 'Chiredzi',
            offeredItemTitle: p.offered_item_title,
            offeredDescription: p.offered_item_description,
            cashTopUp: p.cash_top_up ? `$${p.cash_top_up} USD` : undefined,
            status: p.status,
            createdAt: p.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch seller proposals failed:', e);
      }
    }

    return memoryProposals.filter((p) => listingIds.includes(p.listingId));
  },

  // Get all cash orders for a list of listing IDs belonging to a seller
  getOrdersForSeller: async (listingIds: string[]): Promise<TradeOrder[]> => {
    if (listingIds.length === 0) return [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('trade_orders')
          .select('*')
          .in('listing_id', listingIds)
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((o: any) => ({
            id: o.id,
            listingId: o.listing_id,
            buyerName: o.buyer_name,
            buyerPhone: o.buyer_phone,
            pickupLocation: o.notes || 'Chiredzi',
            currencyChoice: o.currency || 'USD',
            quantity: o.quantity || 1,
            totalPrice: Number(o.agreed_price) || 0,
            status: o.status,
            notes: o.notes,
            createdAt: o.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch seller orders failed:', e);
      }
    }

    return memoryOrders.filter((o) => listingIds.includes(o.listingId));
  },

  // Reviews & Artisan Ratings
  getReviewsForSeller: async (sellerId: string): Promise<TradeReview[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('trade_reviews')
          .select('*')
          .eq('seller_id', sellerId)
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            sellerId: r.seller_id,
            listingId: r.listing_id,
            reviewerName: r.reviewer_name,
            reviewerLocation: r.reviewer_location,
            rating: r.rating,
            tradeType: r.trade_type,
            comment: r.comment,
            createdAt: r.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch reviews failed:', e);
      }
    }

    return memoryReviews.filter((r) => r.sellerId === sellerId);
  },

  createReview: async (review: Omit<TradeReview, 'id' | 'createdAt'>): Promise<TradeReview> => {
    const newReview: TradeReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      try {
        await supabase.from('trade_reviews').insert({
          id: newReview.id,
          seller_id: newReview.sellerId,
          listing_id: newReview.listingId || null,
          reviewer_name: newReview.reviewerName,
          reviewer_location: newReview.reviewerLocation,
          rating: newReview.rating,
          trade_type: newReview.tradeType,
          comment: newReview.comment,
          created_at: newReview.createdAt,
        });
      } catch (e) {
        console.warn('Supabase insert review failed:', e);
      }
    }

    memoryReviews.unshift(newReview);
    return newReview;
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

  // ====================================================================
  // ADMIN COMMAND CENTRE METHODS
  // ====================================================================
  deleteListing: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        await supabase.from('listings').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete listing error:', e);
      }
    }
    memoryListings = memoryListings.filter((l) => l.id !== id);
    saveLocalListings();
    return true;
  },

  deleteProposal: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        await supabase.from('barter_proposals').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete proposal error:', e);
      }
    }
    memoryProposals = memoryProposals.filter((p) => p.id !== id);
    return true;
  },

  getAllProposals: async (): Promise<BarterProposal[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('barter_proposals').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            listingId: r.listing_id,
            proposerName: r.proposer_name,
            proposerPhone: r.proposer_phone,
            proposerLocation: r.proposer_location || 'Harare CBD',
            offeredItemTitle: r.offered_item_title,
            offeredDescription: r.offered_item_description || '',
            cashTopUp: r.cash_top_up ? String(r.cash_top_up) : undefined,
            status: r.status || 'pending',
            createdAt: r.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch proposals error:', e);
      }
    }
    return memoryProposals;
  },

  deleteOrder: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        await supabase.from('trade_orders').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete order error:', e);
      }
    }
    memoryOrders = memoryOrders.filter((o) => o.id !== id);
    return true;
  },

  getAllOrders: async (): Promise<TradeOrder[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('trade_orders').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            listingId: r.listing_id,
            buyerName: r.buyer_name,
            buyerPhone: r.buyer_phone,
            pickupLocation: r.pickup_location || 'Harare CBD',
            currencyChoice: r.currency || 'USD',
            quantity: r.quantity || 1,
            totalPrice: Number(r.agreed_price) || 0,
            notes: r.notes || '',
            status: r.status || 'pending',
            createdAt: r.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch orders error:', e);
      }
    }
    return memoryOrders;
  },

  deleteReview: async (id: string): Promise<boolean> => {
    if (supabase) {
      try {
        await supabase.from('trade_reviews').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete review error:', e);
      }
    }
    memoryReviews = memoryReviews.filter((r) => r.id !== id);
    return true;
  },

  getAllUsers: async () => {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((u: any) => ({
            id: u.id,
            phoneNumber: u.phone_number,
            fullName: u.full_name,
            locationArea: u.location_area || 'Harare CBD',
            avatarUrl: u.avatar_url,
            verifiedArtisan: u.verified_artisan,
            rating: Number(u.rating) || 5.0,
            tradeCount: u.trade_count || 0,
            createdAt: u.created_at,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch users error:', e);
      }
    }
    // Fallback users from memory listings
    const userMap = new Map();
    memoryListings.forEach((l) => {
      if (l.user && l.user.id && !userMap.has(l.user.id)) {
        userMap.set(l.user.id, l.user);
      }
    });
    return Array.from(userMap.values());
  },

  getAdminStats: async () => {
    const listings = await db.getListings({ category: 'all' });
    const proposals = await db.getAllProposals();
    const orders = await db.getAllOrders();
    const users = await db.getAllUsers();
    const reviews = memoryReviews;

    const grossOrderVolumeUSD = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return {
      totalUsers: users.length,
      totalListings: listings.length,
      totalProposals: proposals.length,
      totalOrders: orders.length,
      totalReviews: reviews.length,
      grossOrderVolumeUSD: Number(grossOrderVolumeUSD.toFixed(2)),
    };
  },
};
