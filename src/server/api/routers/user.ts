import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import brcypt from "bcrypt";
import { ACCOUNT_STATUS, ROLE } from "@prisma/client";
import { sendEmail } from "~/server/utils/nodemailer.config";
export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: { shop: true },
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
          role: z
            .nativeEnum(ROLE)
            .refine((role) => role !== "ADMIN", {
              message: "Cannot assign ADMIN role",
            })
            .default("USER"),
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

      const emailSent = await sendEmail({
        html: verifyEmailHtml,
        subject: "Verify your email",
        to: input.email,
      });
      if (!emailSent) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send verification email",
        });
      }
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

const verifyEmailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - ShopSmart</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #f4f4f4;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-NQXhNXBVRXZXBXkXhXrXD8j3Xt6Xz4.png" alt="ShopSmart Logo" width="150" style="display: block;">
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h1 style="margin: 0 0 20px 0; font-size: 24px; text-align: center;">Verify Your Email Address</h1>
                                        <p style="margin: 0 0 20px 0; text-align: center;">Thank you for signing up with ShopSmart. To complete your registration and start using our services, please verify your email address by clicking the button below:</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="https://shopsmart.com/verify-email?token=YOUR_VERIFICATION_TOKEN" style="background-color: #4CAF50; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p style="margin: 20px 0 0 0; text-align: center;">If you didn't create an account with ShopSmart, you can safely ignore this email.</p>
                                        <p style="margin: 20px 0 0 0; text-align: center;">If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
                                        <p style="margin: 20px 0 0 0; text-align: center; word-break: break-all;"><a href="https://shopsmart.com/verify-email?token=YOUR_VERIFICATION_TOKEN" style="color: #4CAF50; text-decoration: underline;">https://shopsmart.com/verify-email?token=YOUR_VERIFICATION_TOKEN</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f4f4f4; padding: 20px 30px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                            <p style="margin: 0; font-size: 14px; color: #666666;">ShopSmart Inc. | 123 Main St, Anytown, AN 12345</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
