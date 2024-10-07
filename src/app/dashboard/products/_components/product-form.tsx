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
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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
  image: z.string().url(),
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
  product: Product;
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
    label: "Product description",
    name: "description",
    placeholder: "Enter the description",
    type: "text",
  },
  {
    label: "Image",
    name: "image",
    placeholder: "Enter the image URL",
    type: "text",
  },
];

const initialState: Product = {
  name: "",
  price: 0,
  description: "",
  image: "",
};
export default function ProductForm(props: ProductFormProps) {
  const router = useRouter();
  const form = useForm<Product>({
    resolver: zodResolver(formSchema),
    defaultValues: props.update ? props.product : initialState,
  });
  const createProductMutation = api.product.create.useMutation({
    onSuccess: () => {
      form.reset(initialState);
      props.setOpen(false);
      router.refresh();
    },
  });

  function onSubmit(data: Product) {
    if (!props.update) {
      return createProductMutation.mutate(data);
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
        <Button
          type="submit"
          className="w-full"
          disabled={createProductMutation.isPending}
        >
          {createProductMutation.isPending ? "Adding" : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
