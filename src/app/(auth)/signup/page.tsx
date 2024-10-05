import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import VendorSignupform from "../_components/signup-form";

export default async function page() {
  const session = await getServerAuthSession();
  if (session) redirect("/dashboard");
  return <VendorSignupform />;
}
