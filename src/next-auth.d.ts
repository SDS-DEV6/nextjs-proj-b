import NextAuth from "next-auth";

declare module "next-auth" {
  // ... previous code
  interface Session {
    user: User; // Make sure this references your extended User interface
  }
}
