import { NoDataIcon } from "@/shared/icons";

export const NoData = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4 border border-[#C3C3C3] rounded-[12px]">
      <NoDataIcon />
      <div className="flex flex-col gap-1 text-center text-[16px]">
        <p className="text-[#A6A6A6]">No hay datos</p>
        <p className="text-[#C3C3C3]">No hay datos para mostrar.</p>
      </div>
    </div>
  );
};
