import { STATUS } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

const imageSchema = z.object({ url: z.string(), key: z.string() });

const productSchema = z.object({
  name: z.string(),
  id: z.string().optional(),
  price: z.number(),
  description: z.string(),
  url: z.string(),
  images: z.array(imageSchema),
  stock: z.number(),
  status: z.nativeEnum(STATUS).optional(),
});

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

  getAllProducts: protectedProcedure.query(async ({ ctx }) => {
    if (
      ctx.session.user.role !== "ADMIN" &&
      ctx.session.user.role !== "VENDOR"
    ) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to view this page",
      });
    }
    if (ctx.session.user.role === "VENDOR") {
      return db.product.findMany({
        where: { createdById: ctx.session.user.id },
      });
    }
    return db.product.findMany();
  }),

  create: protectedProcedure
    .input(productSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (user.role !== "VENDOR")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create products",
        });

      if (!user.emailVerified)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to verify your email first",
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
          url: input.url,
          createdById: user.id,
          shopId: user.shop.id,
          images: input.images,
        },
      });
    }),

  update: protectedProcedure
    .input(productSchema)
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      if (user.role !== "VENDOR")
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update products",
        });
      if (!user.emailVerified)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to verify your email first",
        });
      if (!user.shop) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You need to create a shop first",
        });
      }
      const product = await db.product.findUnique({
        where: { id: input.id },
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      if (product.createdById !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this product",
        });
      }
      if (!input.id)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product ID is required",
        });
      return db.product.update({
        where: { id: input.id },
        data: {
          stock: input.stock,
          name: input.name,
          price: input.price,
          description: input.description,
          url: input.url,
          images: input.images,
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
        include: { createdBy: true, category: true },
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
      const images: Array<{ url: string; key: string }> =
        product.images as Array<{ url: string; key: string }>;
      return { ...product, images };
    }),
});
