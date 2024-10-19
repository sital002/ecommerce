"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

import { api } from "~/trpc/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import type { UploadedFileData } from "uploadthing/types";
import { uploadFiles } from "./actions";

const shopSchema = z.object({
  name: z.string(),
  description: z.string(),
  address: z.string(),
  logo: z.string(),
  banner: z.string(),
  phone: z.string(),
  categories: z.array(z.string()),
});
export function CreateShopForm() {
  const [ownerImage, setOwnerImage] = useState<UploadedFileData | null>(null);
  const [citizenshipImage, setCitizenshipImage] =
    useState<UploadedFileData | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    citizenShipImage: string;
    ownerImage: string;
  } | null>(null);

  const form = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      logo: "",
      banner: "",
      phone: "",
      categories: [],
    },
  });
  const shopMutation = api.shop.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  form.watch();
  const onSubmit = async (data: z.infer<typeof shopSchema>) => {
    if (!previewImage?.citizenShipImage || !previewImage?.ownerImage) return;
    const formData = new FormData();
    formData.append("files", previewImage.citizenShipImage);
    formData.append("files", previewImage.ownerImage);
    const uploadedImages = await uploadFiles(formData);
    console.log(uploadedImages);
    shopMutation.mutate({
      address: data.address,
      banner: data.banner,
      categories: data.categories,
      description: data.description,
      logo: data.logo,
      name: data.name,
      ownerImage: ownerImage?.appUrl ?? "",
      phone: data.phone,
      citizenshipImage: citizenshipImage?.appUrl ?? "",
    });
  };
  return (
    <div className="space-y-4">
      {shopMutation.error && (
        <div className="text-destructive">{shopMutation.error.message}</div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Enter your Shop Name"}</FormLabel>
                <FormControl>
                  <Input placeholder={"ABC"} type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"description"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Enter your Shop description"}</FormLabel>
                <FormControl>
                  <Input placeholder={"ABC"} type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"address"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Enter your Address"}</FormLabel>
                <FormControl>
                  <Input placeholder={"Chitwan"} type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <p>Owner Image</p>
          {previewImage?.ownerImage ? (
            <div className="flex items-center gap-2">
              <Image
                src={previewImage.ownerImage}
                width={300}
                height={300}
                alt="Owner image"
              />
              <Button
                onClick={() => {
                  setPreviewImage((prev) => ({
                    citizenShipImage: prev?.citizenShipImage ?? "",
                    ownerImage: "",
                  }));
                }}
              >
                Delete
              </Button>
            </div>
          ) : (
            <input
              name="files"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  const target = e.currentTarget as FileReader;
                  setPreviewImage((prev) => ({
                    citizenShipImage: prev?.citizenShipImage ?? "",
                    ownerImage: target.result as string,
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />
          )}
          <p>Citizenship Image</p>
          {previewImage?.citizenShipImage ? (
            <div className="flex items-center gap-2">
              <Image
                src={previewImage.citizenShipImage}
                width={300}
                height={300}
                alt="Citizenship image"
              />
              <Button
                onClick={() => {
                  setPreviewImage((prev) => ({
                    citizenShipImage: "",
                    ownerImage: prev?.ownerImage ?? "",
                  }));
                }}
              >
                Delete
              </Button>
            </div>
          ) : (
            <input
              name="files"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                  const target = e.currentTarget as FileReader;
                  setPreviewImage((prev) => ({
                    ownerImage: prev?.ownerImage ?? "",
                    citizenShipImage: target.result as string,
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />
          )}
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
