import { Logotipo } from "@/shared/components/Logotipo";

export const GreetingSection = () => {
  return (
    <div className="flex-1 h-full hidden lg:flex flex-col justify-center items-center bg-white dark:bg-black shadow-greeting rounded-r-[24px] text-black dark:text-white">
      <Logotipo where="greeting" />
    </div>
  );
};
