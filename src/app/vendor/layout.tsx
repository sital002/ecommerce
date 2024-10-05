import Sidebar from "./_components/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="flex">
        <Sidebar />
        <div className="h-full w-full">{children}</div>
      </main>
    </>
  );
}
