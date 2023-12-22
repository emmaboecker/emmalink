import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";
import RedirectComponent from "./redirect-component";

export default async function SlugRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const link = await api.link.getLink.query({ slug });

  if (!link) {
    notFound();
  }

  if (!link.hidden) {
    redirect(link.url);
  }

  return <RedirectComponent url={link.url} />;
}
