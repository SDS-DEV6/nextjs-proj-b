import type { NextAuthConfig } from "next-auth";
import prisma from "@/app/libs/prismadb";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/member");
      if (isOnDashboard) {
        if (isLoggedIn) return true;

        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        const isOnAuth =
          nextUrl.pathname === "/login" || nextUrl.pathname === "/signup";
        if (isOnAuth) return Response.redirect(new URL("/member", nextUrl));

        return true;
      }
      return true;
    },
    session: ({ session, token }) => {
      //console.log("Session callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          ID: token.ID,
          username: token.username,
          email: token.email,
        },
      };
    },
    jwt: async ({ token, user }) => {
      // Assuming the user object contains an email property
      // Adjust based on the actual structure of your user object
      const email = user?.email;

      if (email) {
        const dbUser = await prisma.artist.findUnique({
          where: {
            email: email, // Adjust this to match your database schema
          },
        });

        if (dbUser) {
          return {
            ...token,
            ID: dbUser.artistId,
            username: dbUser.username,
          };
        }
      }

      // Return the token unmodified if no user is found
      return token;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
