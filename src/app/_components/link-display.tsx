import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api as serverApi } from "~/trpc/server";
import { EditButton } from "./edit-button";
import DeleteButton from "./delete-button";
import Link from "next/link";
import CopyButton from "./copy-button";
import { env } from "~/env";

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
                <div className="my-auto flex flex-row gap-2">
                  <CopyButton text={env.APPLICATION_URL + "/" + link.slug} />
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
