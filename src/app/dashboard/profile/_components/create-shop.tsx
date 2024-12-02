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
import { deleteFiles, uploadFiles } from "./actions";
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
  setEditedShop: React.Dispatch<React.SetStateAction<boolean>>;
}
type ImageProps = {
  appUrl: string;
  key: string;
};
export function CreateShopForm({ shop, setEditedShop }: CreateShopFormProps) {
  const [ownerImage, setOwnerImage] = useState<ImageProps | null>(null);
  const [citizenshipImage, setCitizenshipImage] = useState<ImageProps | null>(
    shop?.citizenShipImage ?? null,
  );

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
        ownerImage: {
          appUrl: ownerImage?.appUrl ?? shop.ownerImage,
          key: ownerImage?.key ?? shop.ownerImage,
        },
        phone: data.phone,
        citizenshipImage: {
          appUrl: citizenshipImage?.appUrl ?? shop.citizenShipImage,
          key: citizenshipImage?.key ?? shop.citizenShipImage,
        },
      });
      router.refresh();
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
      ownerImage: {
        appUrl: ownerImage.appUrl,
        key: ownerImage.key,
      },
      phone: data.phone,
      citizenshipImage: {
        appUrl: citizenshipImage.appUrl,
        key: citizenshipImage.key,
      },
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
          {ownerImage ? (
            <div className="flex items-center gap-2">
              <Image
                src={ownerImage.appUrl}
                width={300}
                height={300}
                alt="Owner image"
              />
              <Button
                onClick={async () => {
                  if (ownerImage) {
                    const temp = ownerImage;
                    setOwnerImage(null);
                    const response = await deleteFiles(ownerImage.key);
                    if (!response) {
                      setOwnerImage(temp);
                    }
                  }
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
                setOwnerImage(uploadedImages[0].data);
              }}
            />
          )}
          <p>Citizenship Image</p>
          {citizenshipImage || shop?.citizenShipImage ? (
            <div className="flex items-center gap-2">
              <Image
                src={citizenshipImage?.appUrl ?? shop?.citizenShipImage}
                width={300}
                height={300}
                alt="Citizenship image"
              />
              <Button
                onClick={async (e) => {
                  e.preventDefault();
                  console.log(citizenshipImage);
                  if (citizenshipImage) {
                    const temp = citizenshipImage;
                    setCitizenshipImage(null);
                    const response = await deleteFiles(citizenshipImage.key);
                    if (!response) {
                      setCitizenshipImage(temp);
                    }
                  }
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
              }}
            />
          )}
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            {shop ? (
              <Button
                variant="outline"
                onClick={() => setEditedShop((prev) => !prev)}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Form>
    </div>
  );
}
