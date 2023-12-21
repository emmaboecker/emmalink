import { env } from "~/env";

export type OpenID = {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint: string;
};

export default async function getOpenIDConfig() {
  const response = await fetch(env.OPENID_CONFIGURATION);

  if (response.status !== 200) {
    throw new Error("Failed to fetch OpenID configuration");
  }

  const data = await response.json();
  return data as OpenID;
}
