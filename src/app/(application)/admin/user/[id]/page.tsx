import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import LinkDisplay from "~/app/_components/link-display";
import getGravatarURL from "~/app/lib/gravatar";
import { getPageSession } from "~/server/auth/session";
import { api } from "~/trpc/server";

export default async function UserPage({ params }: { params: { id: string } }) {
  const session = await getPageSession();
  if (!session || session.user.role !== "admin") {
    return notFound();
  }
  const user = await api.user.getUser.query({ id: params.id });

  if (!user) {
    return notFound();
  }

  const gravatar = await getGravatarURL(user.email);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center gap-5">
        <Avatar>
          <AvatarImage src={gravatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">
          {user.name} {user.username !== user.name && `(${user.username})`}
        </h1>
      </div>
      <LinkDisplay
        links={user.links.map((link) => ({
          user,
          ...link,
        }))}
      />
    </div>
  );
}
