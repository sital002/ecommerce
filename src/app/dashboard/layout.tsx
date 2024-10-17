import { VerifyEmailAlert, VerifyShopAlert } from "../_components/alerts";
import Sidebar from "./_components/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="w-full border-l border-l-gray-200 p-2">
          <VerifyEmailAlert />
          <VerifyShopAlert />
          {children}
        </div>
      </main>
    </>
  );
}
