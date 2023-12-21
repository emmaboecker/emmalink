import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { queryClient } from "../db";
import { env } from "~/env";

export const auth = lucia({
  adapter: postgresAdapter(queryClient, {
    user: `${env.DATABASE_PREFIX}_users`,
    key: `${env.DATABASE_PREFIX}_keys`,
    session: `${env.DATABASE_PREFIX}_sessions`,
  }),
  env: env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },

  getUserAttributes: (data) => {
    return {
      username: data.username,
      name: data.name,
      email: data.email,
      role: data.role,
    };
  },
});

export type Auth = typeof auth;
