"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function SignInButton() {
  return <Button onClick={() => signIn("github")}>Sign in</Button>;
}

export function SignOutButton() {
  return (
    <Button onClick={() => signOut()} variant={"ghost"}>
      Sign out
    </Button>
  );
}
