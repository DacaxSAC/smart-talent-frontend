export const FormSection = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="px-8 lg:px-12 w-full lg:w-5/11 h-full flex flex-col justify-center items-center text-black dark:text-white">
      {children}
    </div>
  );
};
