import {
  findSubscriptionsByUserIds,
  findSubscriptionsByTags,
  findSubscriptionsByRoles,
  getAllSubscriptions,
  removePushSubscription,
} from '@/lib/pushSubscriptions';
import { sendPushNotification } from '@/lib/webPush';

function normalizePayload(input) {
  if (!input) return {};
  if (typeof input === 'string') {
    try {
      return JSON.parse(input);
    } catch (err) {
      return { title: 'VIPO', body: input };
    }
  }
  return { ...input };
}

async function deliverToSubscriptions(subscriptions, payload) {
  const normalized = normalizePayload(payload);
  const results = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          normalized,
        );
        results.push({ endpoint: sub.endpoint, ok: true });
      } catch (error) {
        const statusCode = error?.statusCode || error?.status || error?.code;
        if (statusCode === 404 || statusCode === 410) {
          await removePushSubscription(sub.endpoint).catch(() => {});
        }
        results.push({ endpoint: sub.endpoint, ok: false, error: error?.message || 'push_failed' });
      }
    }),
  );

  return results;
}

export async function pushToUsers(userIds = [], payload) {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];
  const subs = await findSubscriptionsByUserIds(userIds);
  if (!subs.length) return [];
  return deliverToSubscriptions(subs, payload);
}

export async function pushToTags(tags = [], payload) {
  if (!Array.isArray(tags) || tags.length === 0) return [];
  const subs = await findSubscriptionsByTags(tags);
  if (!subs.length) return [];
  return deliverToSubscriptions(subs, payload);
}

export async function pushToRoles(roles = [], payload) {
  if (!Array.isArray(roles) || roles.length === 0) return [];
  const subs = await findSubscriptionsByRoles(roles);
  if (!subs.length) return [];
  return deliverToSubscriptions(subs, payload);
}

export async function pushBroadcast(payload) {
  const subs = await getAllSubscriptions();
  if (!subs.length) return [];
  return deliverToSubscriptions(subs, payload);
}
