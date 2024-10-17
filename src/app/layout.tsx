import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "./_components/navbar";
import { Toaster } from "~/components/ui/toaster";

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "This is a ecommerce website bulit for educational purpose",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Navbar />
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
