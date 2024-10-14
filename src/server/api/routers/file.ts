import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export const fileRouter = createTRPCRouter({
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const response = await utapi.deleteFiles(input.id);
      console.log(input.id);
      if (!response.success)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete file",
        });
      return response.success;
    }),
});
