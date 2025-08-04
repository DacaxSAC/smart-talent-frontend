export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col px-5 md:px-8 py-8 gap-7 font-light overflow-y-auto">
      {children}
    </div>
  );
}