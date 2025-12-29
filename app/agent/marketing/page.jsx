import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ObjectId } from 'mongodb';

import { getUserFromCookies } from '@/lib/auth/server';
import { getDb } from '@/lib/db';

import AgentMarketingLibrary from './components/AgentMarketingLibrary';

export const dynamic = 'force-dynamic';

function resolveBaseUrl() {
  const hdrs = headers();
  const proto =
    hdrs.get('x-forwarded-proto') || hdrs.get('x-forwarded-protocol') || hdrs.get('x-url-scheme') || 'http';
  const host = hdrs.get('x-forwarded-host') || hdrs.get('host');

  if (host && host !== '0.0.0.0' && host !== '::1') {
    return `${proto}://${host}`.replace(/\/$/, '');
  }

  const fallback =
    process.env.PUBLIC_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_HOME_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3001';

  return fallback.replace(/\/$/, '');
}

export default async function AgentMarketingPage() {
  const user = await getUserFromCookies();
  if (!user) {
    redirect('/login');
  }
  if (user.role !== 'agent' && user.role !== 'admin') {
    redirect('/');
  }

  const db = await getDb();

  const agent = await db.collection('users').findOne(
    { _id: new ObjectId(user.id) },
    {
      projection: {
        couponCode: 1,
        discountPercent: 1,
        commissionPercent: 1,
        referralId: 1,
      },
    },
  );

  const assets = await db
    .collection('marketing_assets')
    .find({ $or: [{ isActive: { $exists: false } }, { isActive: { $ne: false } }] })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  const baseUrl = resolveBaseUrl();
  const referralCode = agent?.couponCode || agent?.referralId || user.id;
  // Use short /r/ format for cleaner sharing links
  const referralLink = `${baseUrl}/r/${encodeURIComponent(referralCode)}`;

  const formattedAssets = assets.map((asset) => ({
    id: asset._id?.toString() ?? '',
    title: asset.title ?? 'ללא שם',
    type: asset.type ?? 'video',
    mediaUrl: asset.mediaUrl ?? '',
    thumbnailUrl: asset.thumbnailUrl ?? null,
    messageTemplate: asset.messageTemplate ?? '',
    target: asset.target ?? { type: 'products' },
    createdAt: asset.createdAt ? new Date(asset.createdAt).toISOString() : null,
  }));

  return (
    <AgentMarketingLibrary
      agentName={user.fullName || ''}
      referralLink={referralLink}
      couponCode={agent?.couponCode || ''}
      discountPercent={agent?.discountPercent ?? 0}
      commissionPercent={agent?.commissionPercent ?? 0}
      assets={formattedAssets}
      baseUrl={baseUrl}
    />
  );
}
