"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import ProductForm from "./product-form";

export default function ProductHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <div className="my-2 flex justify-between gap-2">
          <p className="text-lg font-medium">Manage your products</p>
          <DialogTrigger>
            <Button asChild>
              <div>
                <Plus className="w-3" />
                Add New
              </div>
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>Add Product</DialogTitle>
          <ProductForm open={isOpen} setOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
