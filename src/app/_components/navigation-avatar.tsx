"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { FiLogOut } from "react-icons/fi";
import { PageSession } from "~/server/auth/session";
import { RiAdminFill } from "react-icons/ri";

export default function EmmalinkNavAvatar(props: {
  session: PageSession;
  avatarUrl?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={`${props.avatarUrl}`} />
          <AvatarFallback>{props.session.user.name[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{props.session.user.name}</DropdownMenuLabel>
        {props.session.user.role === "admin" && (
          <Link href={"/admin"}>
            <DropdownMenuItem>
              <RiAdminFill className="mr-2 h-4 w-4" />
              <span>Admin Interface</span>
            </DropdownMenuItem>
          </Link>
        )}
        <a href={"/logout"}>
          <DropdownMenuItem>
            <FiLogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
