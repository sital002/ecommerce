import React from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { api } from "~/trpc/server";
import Link from "next/link";

export async function VerifyEmailAlert() {
  const user = await api.user.get();
  if (user?.emailVerified) return null;
  return (
    <Alert variant="destructive" className="my-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Verify Email</AlertTitle>
      <AlertDescription>
        Please verify your email to start selling. Check your inbox for the
        verification email.
      </AlertDescription>
    </Alert>
  );
}

export async function VerifyShopAlert() {
  const user = await api.user.get();
  if (user?.role !== "VENDOR") return null;
  if (user && user.shop?.status === "APPROVED") return null;
  return (
    <Alert variant="destructive" className="my-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Verify Shop</AlertTitle>
      <AlertDescription>
        {user.shop?.statusMessage ? (
          <span>{user.shop.statusMessage}. </span>
        ) : (
          <span>Please verify your shop to start selling. </span>
        )}
        Check your{" "}
        <Link href={"/dashboard/profile"} className="underline">
          profile
        </Link>{" "}
        page for the shop verification status.
      </AlertDescription>
    </Alert>
  );
}
