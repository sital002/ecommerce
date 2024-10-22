"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";

import { api, type RouterOutputs } from "~/trpc/react";
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
import { useRouter } from "next/navigation";

const shopSchema = z.object({
  name: z.string(),
  description: z.string(),
  address: z.string(),
  logo: z.string(),
  banner: z.string(),
  phone: z.string(),
  categories: z.array(z.string()),
});

interface CreateShopFormProps {
  shop: RouterOutputs["shop"]["create"] | null;
}
export function CreateShopForm({ shop }: CreateShopFormProps) {
  const [ownerImage, setOwnerImage] = useState<UploadedFileData | null>(null);
  const [citizenshipImage, setCitizenshipImage] =
    useState<UploadedFileData | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    citizenShipImage: string;
    ownerImage: string;
  } | null>(null);

  const initialState = {
    name: "",
    description: "",
    address: "",
    logo: "",
    banner: "",
    phone: "",
    categories: [],
  };
  const form = useForm<z.infer<typeof shopSchema>>({
    resolver: zodResolver(shopSchema),
    defaultValues: shop
      ? {
          address: shop.address,
          description: shop.description,
          logo: shop.logo,
          banner: "",
          categories: [],
          name: shop.name,
          phone: shop.phone,
        }
      : initialState,
  });
  const router = useRouter();
  const utils = api.useUtils();
  const { mutate: createShop, error } = api.shop.create.useMutation({
    onSuccess: async (data) => {
      console.log(data);
      router.refresh();
      await utils.user.get.refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: updateShop, error: updateError } =
    api.shop.update.useMutation({
      onSuccess: async () => {
        console.log("data");
        await utils.user.get.refetch();
        router.refresh();
      },
      onError: (error) => {
        console.error(error);
      },
    });

  form.watch();
  const onSubmit = async (data: z.infer<typeof shopSchema>) => {
    if (shop) {
      updateShop({
        address: data.address,
        banner: data.banner,
        categories: data.categories,
        description: data.description,
        logo: data.logo,
        name: data.name,
        ownerImage: ownerImage?.appUrl ?? shop.ownerImage,
        phone: data.phone,
        citizenshipImage: citizenshipImage?.appUrl ?? shop.citizenShipImage,
      });
      return;
    }
    if (!ownerImage || !citizenshipImage) return;

    createShop({
      address: data.address,
      banner: data.banner,
      categories: data.categories,
      description: data.description,
      logo: data.logo,
      name: data.name,
      ownerImage: ownerImage?.appUrl,
      phone: data.phone,
      citizenshipImage: citizenshipImage?.appUrl,
    });
  };
  return (
    <div className="space-y-4">
      {error && <div className="text-destructive">{error.message}</div>}
      {updateError && (
        <div className="text-destructive">{updateError.message}</div>
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
          {previewImage?.ownerImage || shop?.ownerImage ? (
            <div className="flex items-center gap-2">
              <Image
                src={previewImage?.ownerImage ?? shop?.ownerImage ?? ""}
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
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                const formData = new FormData();
                formData.append("files", file);
                const uploadedImages = await uploadFiles(formData);
                if (!uploadedImages[0]?.data) return;
                setOwnerImage(uploadedImages[0].data);
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
          {previewImage?.citizenShipImage || shop?.citizenShipImage ? (
            <div className="flex items-center gap-2">
              <Image
                src={
                  previewImage?.citizenShipImage ?? shop?.citizenShipImage ?? ""
                }
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
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const formData = new FormData();
                formData.append("files", file);
                const uploadedImages = await uploadFiles(formData);
                if (!uploadedImages[0]?.data) return;
                setCitizenshipImage(uploadedImages[0].data);
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
