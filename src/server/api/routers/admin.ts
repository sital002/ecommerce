import { ACCOUNT_STATUS, ROLE } from "@prisma/client";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getAllVendors: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: {
        role: "VENDOR",
      },
    });
  }),

  getAllUsers: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  getAllProducts: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany();
  }),
  updateUser: adminProcedure
    .input(
      z.object({
        name: z.string(),
        role: z.nativeEnum(ROLE),
        id: z.string(),
        emailVerified: z.boolean(),
        accountStatus: z.nativeEnum(ACCOUNT_STATUS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          role: input.role,
          emailVerified: input.emailVerified ? new Date() : null,
          accountStatus: input.accountStatus,
        },
      });
    }),
});
