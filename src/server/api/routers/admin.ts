import { ACCOUNT_STATUS, ROLE, STATUS } from "@prisma/client";
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

  getPendingShops: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.shop.findMany({
      where: { status: "PENDING" },
      include: { user: true },
    });
  }),
  getAllShops: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.shop.findMany();
  }),
  getShopById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.shop.findUnique({
        where: { id: input.id },
      });
    }),

  updateShopStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        statusMessage: z.string().optional(),
        status: z.nativeEnum(STATUS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.shop.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
          statusMessage: input.statusMessage,
        },
      });
    }),

  getProductById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({ where: { id: input.id } });
    }),
});
