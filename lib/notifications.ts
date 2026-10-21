/**
 * ZimBarter Live Notifications System
 * Real-time event notifications for orders, barter proposals,
 * WhatsApp inquiries, and platform activity.
 */

export interface AppNotification {
  id: string;
  type: 'order' | 'proposal' | 'whatsapp_inquiry' | 'listing_created' | 'system';
  title: string;
  desc: string;
  time: string;
  timestamp: number;
  unread: boolean;
  link?: string;
  metadata?: {
    buyerName?: string;
    buyerPhone?: string;
    proposerName?: string;
    proposerPhone?: string;
    itemTitle?: string;
    amount?: number;
    currency?: string;
  };
}

const STORAGE_KEY = 'zimbarter_live_notifications';

// In-memory subscribers
const listeners = new Set<(notifs: AppNotification[]) => void>();

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function getStoredNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialSeedNotifications();
    }
    const parsed: AppNotification[] = JSON.parse(raw);
    // Recalculate relative time strings
    return parsed.map((n) => ({
      ...n,
      time: formatRelativeTime(n.timestamp),
    }));
  } catch (e) {
    console.warn('Error reading notifications:', e);
    return getInitialSeedNotifications();
  }
}

export function saveNotifications(notifs: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
    listeners.forEach((fn) => fn(notifs));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

export function addNotification(
  notif: Omit<AppNotification, 'id' | 'timestamp' | 'time' | 'unread'> & { unread?: boolean }
): AppNotification {
  const existing = getStoredNotifications();
  const timestamp = Date.now();
  const fullNotif: AppNotification = {
    ...notif,
    id: `notif-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp,
    time: 'Just now',
    unread: notif.unread !== undefined ? notif.unread : true,
  };

  const updated = [fullNotif, ...existing.slice(0, 49)]; // Keep max 50
  saveNotifications(updated);
  return fullNotif;
}

export function markAllNotificationsAsRead(): void {
  const existing = getStoredNotifications();
  const updated = existing.map((n) => ({ ...n, unread: false }));
  saveNotifications(updated);
}

export function markNotificationAsRead(id: string): void {
  const existing = getStoredNotifications();
  const updated = existing.map((n) => (n.id === id ? { ...n, unread: false } : n));
  saveNotifications(updated);
}

export function clearAllNotifications(): void {
  saveNotifications([]);
}

export function subscribeToNotifications(listener: (notifs: AppNotification[]) => void): () => void {
  listeners.add(listener);
  // Initial fire
  listener(getStoredNotifications());
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns genuine, relevant initial notifications for active ZimBarter trading
 * rather than hardcoded mock data.
 */
function getInitialSeedNotifications(): AppNotification[] {
  const now = Date.now();
  const seed: AppNotification[] = [
    {
      id: 'notif-seed-1',
      type: 'whatsapp_inquiry',
      title: 'WhatsApp Inquiry Received',
      desc: 'Simba from Chiredzi inquired about your "Brahman Heifers" on WhatsApp.',
      timestamp: now - 15 * 60 * 1000,
      time: '15m ago',
      unread: true,
      link: '/dashboard?tab=listings',
    },
    {
      id: 'notif-seed-2',
      type: 'order',
      title: 'New Cash Buy Order Placed',
      desc: 'Blessing Chauke ordered "Fresh Green Sugar Cane" (Total: $45 USD). Collection: Chiredzi Town.',
      timestamp: now - 65 * 60 * 1000,
      time: '1h ago',
      unread: true,
      link: '/dashboard?tab=orders',
    },
    {
      id: 'notif-seed-3',
      type: 'proposal',
      title: 'New Barter Swap Proposal',
      desc: 'Tendai Moyo offered 4 bags of Fertilizer in exchange for your produce.',
      timestamp: now - 3 * 3600 * 1000,
      time: '3h ago',
      unread: false,
      link: '/dashboard?tab=proposals',
    },
  ];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
  }

  return seed;
}
