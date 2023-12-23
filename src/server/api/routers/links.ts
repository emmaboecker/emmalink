import { and, asc, desc, eq } from "drizzle-orm";
import { PostgresError } from "postgres";
import { z } from "zod";

import {
  authorizedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { links } from "~/server/db/schema";

export const linkRouter = createTRPCRouter({
  getUserLinks: authorizedProcedure.query(({ ctx }) => {
    return ctx.db.query.links.findMany({
      where: eq(links.userId, ctx.session!.user.userId),
      with: {
        user: true,
      },
      orderBy: [desc(links.createdAt)],
    });
  }),

  getLink: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.links.findFirst({
        where: eq(links.slug, input.slug),
      });
    }),

  updateLink: authorizedProcedure
    .input(
      z.object({
        id: z.number(),
        new: z.object({
          slug: z.string(),
          url: z.string(),
          hidden: z.boolean(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let update = ctx.db.update(links).set(input.new);

      if (ctx.session.user.role !== "admin") {
        update = update.where(
          and(
            eq(links.id, input.id),
            eq(links.userId, ctx.session.user.userId),
          ),
        );
      } else {
        update = update.where(eq(links.id, input.id));
      }

      let updated;
      try {
        updated = (await update.returning())[0];
      } catch (err: any) {
        if (err.code === "23505") {
          throw new Error("Slug already exists");
        }
      }
      if (!updated) {
        throw new Error("Failed to update link.");
      }

      return updated;
    }),

  deleteLink: authorizedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      let deletion;

      if (ctx.session.user.role !== "admin") {
        deletion = ctx.db
          .delete(links)
          .where(
            and(
              eq(links.id, input.id),
              eq(links.userId, ctx.session.user.userId),
            ),
          );
      } else {
        deletion = ctx.db.delete(links).where(eq(links.id, input.id));
      }

      const deletionResult = (await deletion.returning())[0];

      if (!deletionResult) {
        throw new Error(
          "Failed to delete link. This could have happend if you don't have permission to delete this link or there is no link with this id.",
        );
      }

      return deletionResult;
    }),

  createLink: authorizedProcedure
    .input(
      z.object({
        slug: z.string(),
        url: z.string(),
        hidden: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let created;

      try {
        created = await ctx.db
          .insert(links)
          .values({
            ...input,
            createdAt: new Date().getTime(),
            userId: ctx.session.user.userId,
          })
          .returning();
      } catch (err: any) {
        if (err.code === "23505") {
          throw new Error("Slug already exists");
        }
      }

      if (!created) {
        throw new Error("Failed to create link.");
      }

      return created;
    }),
});
