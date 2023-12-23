import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { FiList } from "react-icons/fi";
import { api as serverApi } from "~/trpc/server";

export default function UserDisplay(props: {
  users: Awaited<ReturnType<typeof serverApi.user.getUsers.query>>;
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Links</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.links.length}</TableCell>
              <TableCell className="flex justify-end">
                <Link passHref href={`/admin/user/${user.id}`}>
                  <Button variant="ghost" size="icon">
                    <FiList />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
