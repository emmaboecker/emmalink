"use server";

import { api } from "~/trpc/server";
import LinkDisplay from "../_components/link-display";

export default async function UserLinks() {
  const links = await api.link.getUserLinks.query();

  return <LinkDisplay links={links}></LinkDisplay>;
}
