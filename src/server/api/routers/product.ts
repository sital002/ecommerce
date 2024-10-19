import { TRPCError } from "@trpc/server";
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
        name: z.string().min(3).max(255),
        description: z.string().min(10).max(500),
        price: z.number().min(0).max(1000000),
        image: z.string().url(),
        stock: z.number().default(0),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (user.role !== "VENDOR")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create products",
        });
      if (!user.shop) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to create a shop first",
        });
      }
      return db.product.create({
        data: {
          stock: input.stock,
          name: input.name,
          price: input.price,
          description: input.description,
          url: input.image,
          createdById: user.id,
          shopId: user.shop.id,
        },
      });
    }),
});
