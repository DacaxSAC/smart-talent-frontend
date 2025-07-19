export const FormTitle = ({title, description}:Readonly<{title:string, description:string}>) => {
  return (
    <div className="flex flex-col w-full items-start mb-8">
      <p className="text-start text-[36px] font-[500]">{title}</p>

      <p className="text-medium">{description}</p>
    </div>
  );
};
