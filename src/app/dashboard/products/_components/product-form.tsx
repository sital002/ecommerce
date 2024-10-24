"use client";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { api, type RouterOutputs } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { uploadFiles } from "../../profile/_components/actions";
import { useState } from "react";
import Image from "next/image";

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be at most 100 characters")
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    }),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Price must be a valid number",
    })
    .transform((val) => parseFloat(val))
    .refine((val) => val > 0, {
      message: "Price must be greater than 0",
    }),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be at most 500 characters")
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Description can only contain letters and spaces",
    }),
  stock: z.string().refine((val) => parseInt(val) >= 0, {
    message: "Stock must be a valid number",
  }),
});

type FormOptions = {
  label: string;
  name: keyof z.infer<typeof formSchema>;
  placeholder: string;
  description?: string;
  type: string;
};
type Product = z.infer<typeof formSchema>;

interface UpdateProduct {
  update: true;
  product: NonNullable<RouterOutputs["product"]["getById"]>;
}
interface CreateProduct {
  update?: false;
}
type ProductFormProps = (UpdateProduct | CreateProduct) & {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const formOptions: FormOptions[] = [
  {
    label: "Product Name",
    name: "name",
    placeholder: "Enter your Name",
    type: "text",
  },
  {
    label: "Price",
    name: "price",
    placeholder: "Enter the price",
    type: "number",
  },
  {
    label: "Stock",
    name: "stock",
    placeholder: "Enter the stock",
    type: "number",
  },
  {
    label: "Product description",
    name: "description",
    placeholder: "Enter the description",
    type: "text",
  },
];

const initialState: Product = {
  name: "test product",
  price: 0,
  stock: "0",
  description: "This is a description",
};
export default function ProductForm(props: ProductFormProps) {
  const router = useRouter();
  const [productImages, setProductImages] = useState<
    {
      key: string;
      url: string;
    }[]
  >([]);
  const form = useForm<Product>({
    resolver: zodResolver(formSchema),
    defaultValues: props.update
      ? {
          description: props.product.description,
          name: props.product.name,
          price: props.product.price,
          stock: props.product.stock.toString(),
        }
      : initialState,
  });
  const createProductMutation = api.product.create.useMutation({
    onSuccess: () => {
      form.reset(initialState);
      props.setOpen(false);
      router.refresh();
    },
  });

  function onSubmit(data: Product) {
    if (productImages.length === 0) {
      alert("Please upload at least one image");
      return;
    }
    if (!props.update) {
      return createProductMutation.mutate({
        description: data.description,
        url: productImages[0]?.url ?? "",
        images: productImages,
        name: data.name,
        price: data.price,
        stock: parseInt(data.stock),
      });
    }
  }

  return (
    <Form {...form}>
      <p>{createProductMutation.error?.message}</p>
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
        <p>Product Image</p>
        <div className="flex flex-wrap gap-2">
          {productImages?.map((image) => (
            <Image
              key={image.key}
              src={image.url}
              alt={image.key}
              width={30}
              height={30}
            />
          ))}
        </div>
        <input
          name="files"
          type="file"
          multiple
          accept="image/*"
          onChange={async (e) => {
            const files = e.target.files;
            if (!files) return;
            if (files.length > 5) {
              alert("You can only upload 5 images at a time");
              return;
            }
            const formData = new FormData();
            Array.from(files).forEach((file) => {
              formData.append("files", file);
            });
            const uploadedImages = await uploadFiles(formData);
            const images = uploadedImages.map((image) => ({
              url: image.data?.appUrl ?? "",
              key: image.data?.appUrl ?? "",
            }));
            setProductImages(images);
          }}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createProductMutation.isPending}
        >
          {props.update ? "Update" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
