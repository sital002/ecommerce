import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import brcypt from "bcrypt";
export const userRouter = createTRPCRouter({
  get: publicProcedure.query(async () => {
    return db.product.findMany();
  }),

  create: publicProcedure
    .input(
      z
        .object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(8).max(64),
          confirmPassword: z.string(),
          role: z.enum(["USER", "VENDOR"]).default("USER"),
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
      return db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
        },
      });
    }),
});
