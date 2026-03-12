import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profileCompleted: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    profileCompleted?: boolean;
  }
}
