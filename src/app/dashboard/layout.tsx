import Sidebar from "./_components/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <main className="flex">
        <Sidebar />
        <div className="w-full border-l border-l-gray-200 p-2">{children}</div>
      </main>
    </>
  );
}
