export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex flex-col px-5 md:px-8 pt-10 pb-4 gap-7 font-light">
      {children}
    </div>
  );
}