import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { MapPin, Phone, Clock, Store, FileText, User } from "lucide-react";
import type { RouterOutputs } from "~/trpc/react";
import Image from "next/image";

type ShopInfoPageProps = {
  shop: NonNullable<RouterOutputs["user"]["get"]>["shop"];
};
export default function ShopInfoPage({ shop }: ShopInfoPageProps) {
  console.log(shop);
  if (!shop) return null;
  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={shop.logo} alt={shop.name} />
            <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <div className="text-2xl font-bold">{shop.name}</div>
            <div>{shop.description}</div>
            <Badge
              variant={shop.status === "APPROVED" ? "default" : "secondary"}
              className="mt-2"
            >
              {shop.status}
            </Badge>
          </div>
        </div>
        <div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <MapPin className="text-gray-500" />
              <span>{shop.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="text-gray-500" />
              <span>{shop.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-gray-500" />
              <span>
                Joined on {new Date(shop.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Store className="text-gray-500" />
              <span>
                Last updated on {new Date(shop.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div>
                <div className="flex items-center text-lg">
                  <FileText className="mr-2" />
                  Citizenship Document
                </div>
              </div>
              <div>
                <Image
                  width={200}
                  height={200}
                  src={shop.citizenShipImage}
                  alt="Citizenship Document"
                  className="h-40 w-full rounded-md object-cover"
                />
              </div>
            </div>
            <div>
              <div>
                <div className="flex items-center text-lg">
                  <User className="mr-2" />
                  Owner Photo
                </div>
              </div>
              <div>
                <Image
                  height={200}
                  width={200}
                  src={shop.ownerImage}
                  alt="Shop Owner"
                  className="h-40 w-full rounded-md object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
