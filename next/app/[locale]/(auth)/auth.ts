import NextAuth, { AuthError, NextAuthConfig, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
// Your own logic for dealing with plaintext password strings; be careful!
import { localLogin } from "@/lib/strapi/users";
import { StrapiError } from "@/lib/strapi/strapi-error";
import { StrapiLoginResponse } from "@/types/types";
//import { cookies } from "next/headers";
import { authConfig } from "./config";

declare module 'next-auth' {
    // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  
    interface Session extends DefaultSession {
      strapiToken?: string;
      provider?: 'github' | 'local';
      user: User;
    }
  
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the second parameter of the `session` callback, when using a database.
     */
    interface User {
      // not setting this will throw ts error in authorize function
      strapiUserId?: number;
      blocked?: boolean;
      strapiToken?: string;
    }
}
  
declare module 'next-auth/jwt' {
    // Returned by the `jwt` callback and `getToken`, when using JWT sessions
    interface JWT {
      strapiUserId?: number;
      blocked?: boolean;
      strapiToken?: string;
      provider?: 'local' | 'github';
    }
}

const config = {
  ...authConfig,
  providers: [
        GitHub({
            profile(profile) {
              return { role: profile.role ?? "user", ...profile}
            },
        }),
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                identifier: {},
                password: {},
            },
            async authorize(credentials) {                            
                //console.debug("[auth:authorize]Got credentials:",credentials);
                if (!credentials || !credentials.identifier || !credentials.password) {
                    return null;
                }
                // logic to salt and hash password
                try {
                    // logic to verify if the user exists
                    let responseData = await localLogin({
                        identifier: credentials.identifier as string, 
                        password: credentials.password as string
                    });
                    console.debug("[auth:authorize]Got responseData from localLogin:",responseData);
                    if (responseData.error) {
                        // No user found, so this is their first attempt to login
                        // meaning this is also the place you could do registration
                        throw new AuthError({
                            type:"CredentialsSignin",
                            message: responseData.error.message
                        });
                    }
                    
                    // return user object with their profile data
                    const mappedUser = {
                      id: responseData.user.id.toString(),
                      name: responseData.user.username,
                      email: responseData.user.email,
                      mobile: responseData.user.mobile,
                      image: responseData.user.avatar?.url,  
                      strapiUserId: responseData.user.id,
                      blocked: responseData.user.blocked,
                      strapiToken: responseData.jwt
                    };
                    console.debug("[auth:authorize]Populated next-auth user:",mappedUser);
                    return mappedUser;
                } catch( error ) {
                    throw error;
                }
                
            },
        }),
    ],
    callbacks: {
        async jwt({ token, trigger, account, profile, user, session }) {
            //console.log('[jwt] got', {token,trigger,account,profile,user,session});
            if (account) {
              if (account.provider === 'github') {
                // we now know we are doing a sign in using GitHubProvider
                try {
                  const strapiResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
                    { cache: 'no-cache' }
                  );
                  if (!strapiResponse.ok) {
                    const strapiError: StrapiError = await strapiResponse.json();
                    throw new Error(strapiError.error.message);
                  }
                  const strapiLoginResponse: StrapiLoginResponse =
                    await strapiResponse.json();
                  // customize token
                  // name and email will already be on here
                  token.strapiToken = strapiLoginResponse.jwt;
                  token.provider = account.provider;
                  token.strapiUserId = strapiLoginResponse.user.id;
                  token.blocked = strapiLoginResponse.user.blocked;

                } catch (error) {
                  throw error;
                }
              }
              if (account.provider === 'credentials') {
                // for credentials, not google provider
                // name and email are taken care of by next-auth or authorize
                token.strapiToken = user.strapiToken;
                token.strapiUserId = user.strapiUserId;
                token.provider = 'local';
                token.blocked = user.blocked;
              }
            }          
            return token;
        },
        async session({ token, session }) {
            session.strapiToken = token.strapiToken;
            session.provider = token.provider;
            session.user.strapiUserId = token.strapiUserId;
            session.user.blocked = token.blocked;
            return session;
        },
        async signIn({ user, account, profile }) {
            //console.log('[singIn] Got:', { account, profile, user });
            if (
              account &&
              account.provider === 'github' &&
              profile &&
              'email_verified' in profile
            ) {
              if (!profile.email_verified) return false;
            }
            return true;
        },
    },
} satisfies NextAuthConfig;

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth(config);