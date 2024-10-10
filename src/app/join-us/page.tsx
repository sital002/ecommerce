import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Bike, Store } from "lucide-react";
import Link from "next/link";

export default function BecomePartner() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-center text-3xl font-bold">Join Our Platform</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Become a Seller</CardTitle>
            <CardDescription>
              Start selling your products on our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4 h-48 w-full">
              <Store size={180} />
            </div>
            <ul className="list-inside list-disc space-y-2">
              <li>Access to millions of customers</li>
              <li>Easy-to-use seller dashboard</li>
              <li>Secure payment processing</li>
              <li>Marketing and promotional tools</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={"/signup?partner=seller"}>Become a Seller</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Become a Delivery Person</CardTitle>
            <CardDescription>
              Join our delivery network and earn money
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="mb-4 h-48 w-full">
              <Bike size={180} />
            </div>
            <ul className="list-inside list-disc space-y-2">
              <li>Flexible working hours</li>
              <li>Competitive pay rates</li>
              <li>User-friendly delivery app</li>
              <li>Regular payment cycles</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={"/signup?partner=delivery-person"}>
                Become a delivery person
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
