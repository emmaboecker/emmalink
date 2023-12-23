"use client";

import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { api } from "~/trpc/react";
import revalidatePathAction from "../_actions/revalidate-path";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function DeleteButton({ id }: { id: number }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const deleteMutation = api.link.deleteLink.useMutation({
    onSuccess() {
      revalidatePathAction(pathname);
      toast({
        title: "Link deleted",
        description: `The link has been deleted.`,
      });
    },
    onError(_) {
      toast({
        title: "Failed to delete link",
        description: `The link could not be deleted. Check browser console for more details.`,
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={() => {
        deleteMutation.mutate({ id });
      }}
      disabled={deleteMutation.isLoading}
      variant="ghost"
      size="icon"
      title="Delete link"
    >
      <MdDeleteOutline className="h-4 w-4" />
    </Button>
  );
}
