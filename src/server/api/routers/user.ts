import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import brcypt from "bcrypt";
import { ACCOUNT_STATUS, ROLE } from "@prisma/client";
export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        role: z.nativeEnum(ROLE),
        emailVerified: z.boolean(),
        accountStatus: z.nativeEnum(ACCOUNT_STATUS),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          role: input.role,
          emailVerified: input.emailVerified ? new Date() : null,
          accountStatus: input.accountStatus,
        },
      });
    }),

  create: publicProcedure
    .input(
      z
        .object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8).max(64),
          confirmPassword: z.string(),
          role: z.nativeEnum(ROLE).default("USER"),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    )
    .mutation(async ({ input, ctx }) => {
      const userExists = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (userExists)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User already exists",
        });

      const hashedPassword = await brcypt.hash(input.password, 10);
      if (!hashedPassword)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to hash password",
        });
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
        },
      });
    }),
});
