"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "~/components/ui/card";
import Link from "next/link";
import { api } from "~/trpc/react";

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "Name is required",
      })
      .max(64, {
        message: "Name must be at most 64 characters",
      })
      .regex(/^[a-zA-Z\s]*$/, {
        message: "Name can only contain letters and spaces",
      }),
    email: z
      .string()
      .min(1, {
        message: "Email is required",
      })
      .email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters",
      })
      .max(64, {
        message: "Password must be at most 64 characters",
      }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function VendorSignupform() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirm_password: "",
    },
  });
  const signUpMutation = api.user.create.useMutation();
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    signUpMutation.mutate({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirm_password,
      name: data.name,
      role: "VENDOR",
    });
  }

  type FormOptions = {
    label: string;
    name: keyof z.infer<typeof formSchema>;
    placeholder: string;
    description?: string;
    type: string;
  };
  const formOptions: FormOptions[] = [
    {
      label: "Name",
      name: "name",
      placeholder: "Enter your Name",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      description: "We'll never share your email with anyone else.",
      type: "email",
    },
    {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      description: "Make sure it's at least 8 characters.",
      type: "password",
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      placeholder: "Confirm your password",
      description: "Make sure it matches the password above.",
      type: "password",
    },
  ];
  return (
    <Card className="mx-auto mt-4 max-w-xl p-2">
      <h2 className="text-center text-xl">Become a Seller</h2>
      <p className="text-destructive">{signUpMutation.error?.message}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {formOptions.map((option) => (
            <FormField
              key={option.name}
              control={form.control}
              name={option.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{option.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={option.placeholder}
                      type={option.type}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>{option.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <p className="my-2 text-center">
        Already have an account? {""}
        <Link href={"/signin"} className="underline">
          Signin
        </Link>
      </p>
    </Card>
  );
}
