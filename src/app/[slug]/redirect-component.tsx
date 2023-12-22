"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectComponent({ url }: { url: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(url);
  }, []);
  return (
    <div className="container py-5">
      <p>
        Redirecting to{" "}
        <Link href={url} className="underline">
          {url}
        </Link>
      </p>
      <noscript>
        You need to enable Javascript to be redirected automatically. Click on
        the link instead
      </noscript>
    </div>
  );
}
