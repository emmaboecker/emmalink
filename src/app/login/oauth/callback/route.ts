import {
  OAuthRequestError,
  validateOAuth2AuthorizationCode,
} from "@lucia-auth/oauth";
import { User } from "lucia";
import { cookies, headers } from "next/headers";

import type { NextRequest } from "next/server";
import { env } from "~/env";
import { auth } from "~/server/auth/auth";
import getOpenIDConfig from "~/server/auth/openid";

type AccessTokenResult = {
  access_token: string;
  token_type: string;
};

type UserInfo = {
  sub: string;
  name: string;
  email: string;
  groups: string[];
  preferred_username: string;
};

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const opneIDConfig = await getOpenIDConfig();

  const storedState = cookies().get("github_oauth_state")?.value;
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const response = await validateOAuth2AuthorizationCode<AccessTokenResult>(
      code,
      opneIDConfig.token_endpoint,
      {
        clientId: env.OAUTH_CLIENT_ID,
        clientPassword: {
          clientSecret: env.OAUTH_CLIENT_SECRET,
          authenticateWith: "client_secret",
        },
        redirectUri: `${env.APPLICATION_URL}/login/oauth/callback`,
      },
    );

    async function getUser(): Promise<UserInfo> {
      const userInfo = await fetch(opneIDConfig.userinfo_endpoint, {
        headers: {
          Authorization: `${response.token_type} ${response.access_token}`,
        },
      });

      if (userInfo.status !== 200) {
        throw new Error("Failed to fetch user info");
      }

      return userInfo.json();
    }

    const user = await getUser();

    let luciaUser: User;
    try {
      luciaUser = await auth.getUser(user.sub);

      if (
        luciaUser.role !==
        (user.groups.includes("emmalink-admin") ? "admin" : "user")
      ) {
        await auth.updateUserAttributes(luciaUser.userId, {
          role: user.groups.includes("emmalink-admin") ? "admin" : "user",
        });
        await auth.invalidateAllUserSessions(luciaUser.userId);
      }
    } catch (e) {
      console.error(e);
      luciaUser = await auth.createUser({
        userId: user.sub,
        key: {
          providerUserId: user.sub,
          providerId: "oauth",
          password: null,
        },
        attributes: {
          username: user.preferred_username,
          name: user.name,
          email: user.email,
          role: user.groups.includes("emmalink-admin") ? "admin" : "user",
        },
      });
    }

    const session = await auth.createSession({
      userId: luciaUser.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(request.method, {
      cookies,
      headers,
    });
    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
