export const FormSection = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="px-10 sm:w-full lg:w-3/7 h-full flex flex-col justify-center items-center text-black dark:text-white">
      {children}
    </div>
  );
};
