import { asc, desc, eq } from "drizzle-orm";
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
      const update = await ctx.db
        .update(links)
        .set(input.new)
        .where(eq(links.id, input.id));

      return update[0] as typeof links.$inferSelect | undefined;
    }),

  deleteLink: authorizedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.db.delete(links).where(eq(links.id, input.id));
      return deleted[0]! as typeof links.$inferSelect;
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
      const created = await ctx.db.insert(links).values({
        ...input,
        createdAt: new Date().getTime(),
        userId: ctx.session.user.userId,
      });

      return created[0] as typeof links.$inferSelect | undefined;
    }),
});
