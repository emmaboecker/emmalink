import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { getPageSession } from "~/server/auth/session";
import { TRPCReactProvider } from "~/trpc/react";
import EmmalinkNavAvatar from "../_components/navigation-avatar";
import EmmalinkNavigation from "../_components/navigation-menu";
import getGravatarURL from "../lib/gravatar";

export const metadata = {
  title: "Emmalink",
  description: "URL shortner by Emma :D",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getPageSession();
  const gravatar = await getGravatarURL(session?.user.email);

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
                <EmmalinkNavAvatar session={session} avatarUrl={gravatar} />
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
        <main className="container h-full w-full">
          <div className=" py-5">{children}</div>
        </main>
      </TRPCReactProvider>
      <Toaster />
    </>
  );
}
