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
}) {
  return (
    <> 
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Slug</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>{link.slug}</TableCell>
              <TableCell className="break-all md:break-normal">
                <Link href={link.url} target="_blank">
                  {link.url}
                </Link>
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="my-auto flex flex-col md:flex-row md:gap-2">
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
