import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import LoginForm from "~/app/(auth)/_components/login-form";

export default async function page() {
  const session = await getServerAuthSession();
  if (session) redirect("/dashboard");
  return <LoginForm title="Signin as Seller" />;
}
