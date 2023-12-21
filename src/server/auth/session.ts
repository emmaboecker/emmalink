import { cache } from "react";
import { auth } from "./auth";
import * as context from "next/headers";
import { User } from "lucia";

export type PageSession = {
  user: User;
  sessionId: string;
  activePeriodExpiresAt: Date;
  idlePeriodExpiresAt: Date;
  state: "idle" | "active";
  fresh: boolean;
};

export const getPageSession = cache(() => {
  const authRequest = auth.handleRequest("GET", context);
  return authRequest.validate() as Promise<PageSession | undefined>;
});
