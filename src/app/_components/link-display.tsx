import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api as serverApi } from "~/trpc/server";
import { EditButton } from "./edit-button";
import DeleteButton from "./delete-button";
import Link from "next/link";

export default function LinkDisplay(props: {
  links: Awaited<ReturnType<typeof serverApi.link.getUserLinks.query>>;
  showUser?: boolean;
}) {
  const { showUser = false } = props;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {showUser && <TableHead className="w-[100px]">User</TableHead>}
            <TableHead>Slug</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.links.map((link) => (
            <TableRow key={link.id}>
              {showUser && (
                <TableCell className="font-medium">
                  {link.user.username}
                </TableCell>
              )}
              <TableCell>{link.slug}</TableCell>
              <TableCell>
                <Link href={link.url} target="_blank">
                  {link.url}
                </Link>
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex flex-row gap-2 my-auto">
                  <EditButton {...link} />
                  <DeleteButton id={link.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
