import { createOAuth2AuthorizationUrl } from "@lucia-auth/oauth";
import * as context from "next/headers";
import { redirect } from "next/navigation";

import type { NextRequest } from "next/server";
import { env } from "~/env";
import getOpenIDConfig from "~/server/auth/openid";

export const dynamic = "force-dynamic";

export const GET = async (_request: NextRequest) => {
  const openIDConfig = await getOpenIDConfig();

  const [url, state] = await createOAuth2AuthorizationUrl(
    openIDConfig.authorization_endpoint,
    {
      clientId: env.OAUTH_CLIENT_ID,
      scope: ["email", "openid", "profile"],
      redirectUri: `${env.APPLICATION_URL}/login/oauth/callback`,
    },
  );
  context.cookies().set("github_oauth_state", state, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect(url.toString());
};
