import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shopRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        address: z.string(),
        logo: z.string(),
        phone: z.string(),
        banner: z.string(),
        ownerImage: z.string(),
        citizenshipImage: z.string(),
        categories: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (user.role !== "VENDOR")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create products",
        });
      if (user.shop) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You have already created a shop",
        });
      }
      return ctx.db.shop.create({
        data: {
          name: input.name,
          description: input.description,
          ownerImage: input.ownerImage,
          address: input.address,
          citizenShipImage: input.citizenshipImage,
          logo: input.logo,
          phone: input.phone,
          userId: user.id,
        },
      });
    }),
});
