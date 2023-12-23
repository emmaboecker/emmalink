"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import { z } from "zod";
import { api } from "~/trpc/react";
import revalidatePathAction from "../_actions/revalidate-path";
import { useState } from "react";

const FormSchema = z.object({
  slug: z.string().min(3, {
    message: "slug must be at least 3 characters.",
  }),
  url: z.string().url({
    message: "must be a valid URL.",
  }),
  hidden: z.boolean(),
});

export default function AddButton() {
  const { toast } = useToast();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      slug: "",
      url: "",
      hidden: false,
    },
  });
  const [open, setOpen] = useState(false);

  const mutation = api.link.createLink.useMutation({
    onSuccess: () => {
      revalidatePathAction(pathname);
      toast({
        title: "Link created",
        description: `The link has been created.`,
      });
      setOpen(false);
      form.reset();
    },
    onError: (err) => {
      form.setError("slug", { message: err.message });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    mutation.mutate({
      slug: data.slug,
      url: data.url,
      hidden: data.hidden,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogTrigger asChild>
        <Button>
          <FiPlusCircle className="mr-2 h-4 w-4" /> Add Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="underline">Add Link</DialogTitle>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 pt-5"
            >
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel className="text-md ">Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="emma" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel className="text-md">URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://boecker.dev" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hidden"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hidden</FormLabel>
                      <FormDescription>
                        this will hide the URL to redirect to from e.g. discord
                        embeds
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={mutation.isLoading}>
                Add Link
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
