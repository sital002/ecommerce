import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const productRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return db.product.findMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return db.product.create({
        data: {
          name: input.name,
          price: input.price,
          createdById: ctx.session.user.id,
        },
      });
    }),
});
