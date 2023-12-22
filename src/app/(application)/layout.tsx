import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { PageSession, getPageSession } from "~/server/auth/session";
import { TRPCReactProvider } from "~/trpc/react";
import EmmalinkNavAvatar from "../_components/navigation-avatar";
import EmmalinkNavigation from "../_components/navigation-menu";

export const metadata = {
  title: "Emmalink",
  description: "URL shortner by Emma :D",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

async function getGravatar(session?: PageSession): Promise<string | undefined> {
  if (!session) {
    return undefined;
  }

  const email = session.user.email;

  const hashArray = Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(email)),
    ),
  );
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPageSession();
  const gravatar = await getGravatar(session);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex flex-row items-center justify-between">
          {session ? (
            <>
              <div className="flex flex-row gap-3">
                <EmmalinkNavigation />
              </div>
              <div className="flex items-center">
                <EmmalinkNavAvatar session={session} emailHash={gravatar} />
              </div>
            </>
          ) : (
            <>
              <Link href={"/login/oauth"} passHref>
                <Button>Login</Button>
              </Link>
            </>
          )}
        </div>
      </header>
      <TRPCReactProvider cookies={cookies().toString()}>
        <main className="h-full w-full">
          <div className="container py-5">{children}</div>
        </main>
      </TRPCReactProvider>
      <Toaster />
    </>
  );
}
