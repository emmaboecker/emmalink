"use server";

import { getPageSession } from "~/server/auth/session";
import UserLinks from "./userlinks";
import AddButton from "../_components/add-button";

export default async function Home() {
  const session = await getPageSession();

  if (!session) {
    return <>You need to log in</>;
  }

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex flex-row items-center gap-5">
        <h1 className="text-2xl font-bold">Your links</h1>
        <AddButton />
      </div>
      <UserLinks />
    </div>
  );
}
