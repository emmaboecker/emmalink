import { notFound } from "next/navigation";
import UserDisplay from "~/app/_components/user-display";
import { getPageSession } from "~/server/auth/session";
import { api } from "~/trpc/server";

export default async function AdminPage() {
  const session = await getPageSession();
  if (!session || session.user.role !== "admin") {
    return notFound();
  }
  const users = await api.user.getUsers.query();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">User Management</h1>
      <UserDisplay users={users} />
    </div>
  );
}
