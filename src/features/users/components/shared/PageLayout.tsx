export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col px-5 md:px-8 py-15 gap-11 font-light">
      {children}
    </div>
  );
}