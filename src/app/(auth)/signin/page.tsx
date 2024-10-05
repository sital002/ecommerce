import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import VendorLoginForm from "~/app/(auth)/_components/vendor-login-form";

export default async function page() {
  const session = await getServerAuthSession();
  if (session) redirect("/dashboard");
  return <VendorLoginForm />;
}
