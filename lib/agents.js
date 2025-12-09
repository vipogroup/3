import { ObjectId } from 'mongodb';
import { connectMongo } from '@/lib/mongoose';
import User from '@/models/User';

export const DEFAULT_AGENT_DISCOUNT_PERCENT = 10;
export const DEFAULT_AGENT_COMMISSION_PERCENT = 12;

const transliterationMap = {
  א: 'a',
  ב: 'b',
  ג: 'g',
  ד: 'd',
  ה: 'h',
  ו: 'v',
  ז: 'z',
  ח: 'ch',
  ט: 't',
  י: 'y',
  כ: 'k',
  ך: 'k',
  ל: 'l',
  מ: 'm',
  ם: 'm',
  נ: 'n',
  ן: 'n',
  ס: 's',
  ע: 'a',
  פ: 'p',
  ף: 'p',
  צ: 'ts',
  ץ: 'ts',
  ק: 'k',
  ר: 'r',
  ש: 'sh',
  ת: 't',
};

export function transliterateToSlug(input = '') {
  if (!input) return 'agent';

  const normalized = input
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => {
      if (transliterationMap[char]) return transliterationMap[char];
      if (/[a-z0-9]/.test(char)) return char;
      if (char === ' ') return '-';
      if (/[-_]/.test(char)) return char;
      return '';
    })
    .join('');

  const collapsed = normalized.replace(/[-_]{2,}/g, '-');
  const trimmed = collapsed.replace(/^-+|-+$/g, '');
  return trimmed || 'agent';
}

export async function generateAgentCoupon({ fullName, agentId }) {
  if (!fullName || typeof fullName !== 'string') {
    throw new Error('generateAgentCoupon: fullName is required');
  }

  await connectMongo();

  const slugBase = transliterateToSlug(fullName);

  const existing = await User.aggregate([
    { $match: { couponSlug: slugBase } },
    { $group: { _id: null, maxSeq: { $max: '$couponSequence' } } },
  ]);

  const nextSeq = (existing[0]?.maxSeq || 0) + 1;
  const sequenceStr = String(nextSeq).padStart(3, '0');
  const couponCode = `${slugBase}-${sequenceStr}`;

  let currentAgent = null;
  if (agentId) {
    currentAgent = await User.findById(agentId).lean();
    await User.updateOne(
      { _id: new ObjectId(agentId) },
      {
        $set: {
          couponCode,
          couponSlug: slugBase,
          couponSequence: nextSeq,
          ...(currentAgent?.couponStatus ? {} : { couponStatus: 'active' }),
          ...(currentAgent?.discountPercent == null
            ? { discountPercent: DEFAULT_AGENT_DISCOUNT_PERCENT }
            : {}),
          ...(currentAgent?.commissionPercent == null
            ? { commissionPercent: DEFAULT_AGENT_COMMISSION_PERCENT }
            : {}),
        },
      },
    );
  }

  return { couponCode, couponSlug: slugBase, couponSequence: nextSeq };
}
