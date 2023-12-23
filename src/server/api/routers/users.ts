import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  getUsers: adminProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany({
      orderBy: [asc(users.name)],
      with: {
        links: true,
      },
    });
  }),

  getUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        with: {
          links: true,
        },
      });
    }),
});
