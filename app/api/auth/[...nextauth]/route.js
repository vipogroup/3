import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getDb } from '@/lib/db';

/**
 * NextAuth configuration for Google OAuth
 * Includes legacy JWT bridge for compatibility with existing auth system
 */

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  callbacks: {
    /**
     * Sign-in callback - handles user upsert and referral attribution
     */
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') {
        return true;
      }

      try {
        const db = await getDb();
        const users = db.collection('users');

        const email = user.email?.toLowerCase().trim();
        if (!email) {
          console.error('[GOOGLE_AUTH] No email from Google');
          return false;
        }

        // Check if user exists
        let existingUser = await users.findOne({ email });

        if (!existingUser) {
          // Note: Skip referral from cookies in signIn callback - handled elsewhere
          let referredBy = null;

          // Create new user (agent role by default for Google signups)
          const newUser = {
            fullName: user.name || email.split('@')[0],
            email,
            phone: null, // Will be collected in onboarding
            role: 'agent',
            passwordHash: null, // OAuth users don't have password
            provider: 'google',
            providerAccountId: account.providerAccountId,
            image: user.image || null,
            isActive: true,
            referredBy,
            referralsCount: 0,
            referralCount: 0,
            commissionBalance: 0,
            onboardingCompletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await users.insertOne(newUser);
          existingUser = { ...newUser, _id: result.insertedId };

          console.log('[GOOGLE_AUTH] Created new user:', {
            userId: String(existingUser._id),
            email,
            referredBy: referredBy ? String(referredBy) : null,
          });

          // Update referrer counters if applicable
          if (referredBy) {
            try {
              await users.updateOne(
                { _id: referredBy },
                {
                  $inc: {
                    referralsCount: 1,
                    referralCount: 1,
                    commissionBalance: 25, // Commission per referral
                  },
                }
              );
              console.log('[GOOGLE_AUTH] Referral applied:', String(referredBy));
            } catch (e) {
              console.error('[GOOGLE_AUTH] Failed to update referrer:', e.message);
            }
          }
        } else {
          // Update existing user with provider info if missing
          if (!existingUser.provider) {
            await users.updateOne(
              { _id: existingUser._id },
              {
                $set: {
                  provider: 'google',
                  providerAccountId: account.providerAccountId,
                  image: user.image || existingUser.image,
                  updatedAt: new Date(),
                },
              }
            );
          }
          console.log('[GOOGLE_AUTH] Existing user signed in:', String(existingUser._id));
        }

        return true;
      } catch (error) {
        console.error('[GOOGLE_AUTH] Sign-in error:', error);
        return false;
      }
    },

    /**
     * JWT callback - adds user data to token
     */
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' && user?.email) {
        try {
          const db = await getDb();
          const users = db.collection('users');
          const dbUser = await users.findOne(
            { email: user.email.toLowerCase().trim() },
            { projection: { _id: 1, role: 1, fullName: 1, onboardingCompletedAt: 1 } }
          );

          if (dbUser) {
            token.userId = String(dbUser._id);
            token.role = dbUser.role || 'agent';
            token.fullName = dbUser.fullName;
            token.onboardingCompletedAt = dbUser.onboardingCompletedAt;
          }
        } catch (e) {
          console.error('[GOOGLE_AUTH] JWT callback error:', e.message);
        }
      }

      return token;
    },

    /**
     * Session callback - exposes user data to client
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.fullName = token.fullName;
        session.user.onboardingCompletedAt = token.onboardingCompletedAt;
      }
      return session;
    },

    /**
     * Redirect callback - handles post-login routing
     */
    async redirect({ url, baseUrl }) {
      // If signing in, check if user needs onboarding
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl + '/dashboard';
    },
  },

  // Note: Legacy cookie bridge removed - using NextAuth tokens directly
  // The requireAuthApi function now supports both NextAuth and legacy tokens
});

export { handler as GET, handler as POST };
