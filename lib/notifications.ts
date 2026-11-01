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

const STORAGE_KEY = 'zimbarter_live_notifications_v2';

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
    // Clean legacy mock seed key
    if (localStorage.getItem('zimbarter_live_notifications')) {
      localStorage.removeItem('zimbarter_live_notifications');
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: AppNotification[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Recalculate relative time strings
    return parsed.map((n) => ({
      ...n,
      time: formatRelativeTime(n.timestamp),
    }));
  } catch (e) {
    console.warn('Error reading notifications:', e);
    return [];
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
