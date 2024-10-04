import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const productRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return db.product.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.product.create({
        data: {
          name: input.name,
          price: input.price,
          url: input.url,
          createdById: "cm1uihcgi0000c31osqaq2en3",
        },
      });
    }),
});
