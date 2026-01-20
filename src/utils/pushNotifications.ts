// Push Notifications utility for Dad Hub

interface DadHubNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{ action: string; title: string; icon?: string }>;
  requireInteraction?: boolean;
}

class PushNotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  /**
   * Get current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('Push notifications not supported');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  /**
   * Initialize service worker registration
   */
  async initialize(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.ready;
      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(vapidPublicKey: string): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      await this.initialize();
    }

    if (!this.swRegistration) {
      return null;
    }

    try {
      const applicationServerKey = this.urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.swRegistration) {
      return false;
    }

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  /**
   * Check if user is subscribed to push notifications
   */
  async isSubscribed(): Promise<boolean> {
    if (!this.swRegistration) {
      await this.initialize();
    }

    if (!this.swRegistration) {
      return false;
    }

    const subscription = await this.swRegistration.pushManager.getSubscription();
    return subscription !== null;
  }

  /**
   * Show a local notification (for testing or immediate notifications)
   */
  async showNotification(options: DadHubNotificationOptions): Promise<boolean> {
    if (this.getPermissionStatus() !== 'granted') {
      return false;
    }

    if (!this.swRegistration) {
      await this.initialize();
    }

    if (!this.swRegistration) {
      return false;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const notificationOptions: any = {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: options.badge || '/icons/badge-72x72.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
        vibrate: [200, 100, 200],
      };

      // Actions are only supported in service worker context
      if (options.actions) {
        notificationOptions.actions = options.actions;
      }

      await this.swRegistration.showNotification(options.title, notificationOptions);
      return true;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotifications = new PushNotificationService();

// Notification types for Dad Hub
export const NotificationTypes = {
  DAILY_TIP: 'daily_tip',
  STREAK_REMINDER: 'streak_reminder',
  NEW_MESSAGE: 'new_message',
  FRIEND_REQUEST: 'friend_request',
  QUEST_COMPLETE: 'quest_complete',
  LEVEL_UP: 'level_up',
  GROUP_ACTIVITY: 'group_activity',
  EVENT_REMINDER: 'event_reminder',
  DAD_OF_WEEK: 'dad_of_week',
} as const;

// Pre-built notification templates
export const NotificationTemplates = {
  dailyTip: (tip: string): DadHubNotificationOptions => ({
    title: '💡 Daily Dad Tip',
    body: tip,
    tag: NotificationTypes.DAILY_TIP,
    data: { type: NotificationTypes.DAILY_TIP },
  }),

  streakReminder: (streakDays: number): DadHubNotificationOptions => ({
    title: '🔥 Keep Your Streak!',
    body: `Don't lose your ${streakDays}-day streak! Check in today to keep it going.`,
    tag: NotificationTypes.STREAK_REMINDER,
    requireInteraction: true,
    data: { type: NotificationTypes.STREAK_REMINDER },
  }),

  newMessage: (senderName: string): DadHubNotificationOptions => ({
    title: '💬 New Message',
    body: `${senderName} sent you a message`,
    tag: NotificationTypes.NEW_MESSAGE,
    data: { type: NotificationTypes.NEW_MESSAGE },
  }),

  friendRequest: (senderName: string): DadHubNotificationOptions => ({
    title: '👥 Friend Request',
    body: `${senderName} wants to connect with you`,
    tag: NotificationTypes.FRIEND_REQUEST,
    actions: [
      { action: 'accept', title: 'Accept' },
      { action: 'decline', title: 'Decline' },
    ],
    data: { type: NotificationTypes.FRIEND_REQUEST },
  }),

  questComplete: (questName: string, xpEarned: number): DadHubNotificationOptions => ({
    title: '🎯 Quest Complete!',
    body: `You completed "${questName}" and earned ${xpEarned} XP!`,
    tag: NotificationTypes.QUEST_COMPLETE,
    data: { type: NotificationTypes.QUEST_COMPLETE },
  }),

  levelUp: (newLevel: number, levelName: string): DadHubNotificationOptions => ({
    title: '⬆️ Level Up!',
    body: `Congratulations! You reached Level ${newLevel}: ${levelName}`,
    tag: NotificationTypes.LEVEL_UP,
    requireInteraction: true,
    data: { type: NotificationTypes.LEVEL_UP },
  }),

  eventReminder: (eventName: string, timeUntil: string): DadHubNotificationOptions => ({
    title: '📅 Event Reminder',
    body: `"${eventName}" starts ${timeUntil}`,
    tag: NotificationTypes.EVENT_REMINDER,
    data: { type: NotificationTypes.EVENT_REMINDER },
  }),
};

export default pushNotifications;
