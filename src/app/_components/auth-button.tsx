"use client";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export function SignInButton() {
  return <Button onClick={() => signIn("github")}>Sign in</Button>;
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        signOut()
          .then(() => {
            router.refresh();
          })
          .catch(() => {
            router.refresh();
          });
      }}
      variant={"ghost"}
    >
      Sign out
    </Button>
  );
}
