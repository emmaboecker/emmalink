import * as context from "next/headers";
import { RedirectType, redirect } from "next/navigation";

import type { NextRequest } from "next/server";
import { auth } from "~/server/auth/auth";
import getOpenIDConfig from "~/server/auth/openid";

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);

  redirect((await getOpenIDConfig()).end_session_endpoint, RedirectType.push);
};
