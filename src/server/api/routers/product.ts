import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const productRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user.role === "ADMIN") {
      return db.product.findMany({ where: { status: "APPROVED" } });
    }
    if (ctx.session?.user.role === "VENDOR") {
      return db.product.findMany({
        where: { createdById: ctx.session.user.id },
      });
    }
    return db.product.findMany({ where: { status: "APPROVED" } });
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

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      if (
        ctx.session?.user.role !== "ADMIN" &&
        ctx.session?.user.role !== "VENDOR"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this product",
        });
      }

      const product = await db.product.findUnique({
        where: { id: input.id },
        include: { createdBy: true },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      if (
        ctx.session?.user.role === "VENDOR" &&
        product.createdById !== ctx.session.user.id
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view this product",
        });
      }
      return product;
    }),
});
