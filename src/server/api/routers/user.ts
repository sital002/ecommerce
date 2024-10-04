import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const userRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return db.product.findMany();
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      console.log(user.role, "ROle");
      if (user.role === "USER")
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      return db.product.create({
        data: {
          name: input.name,
          price: input.price,
          url: input.url,
          createdById: user.id,
        },
      });
    }),
});
