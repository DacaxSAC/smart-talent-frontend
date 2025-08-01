import { motion } from "framer-motion";
export const CreationButton = ({handleClick}:Readonly<{handleClick:()=>void}>) => {
  return (
    <div className="flex justify-end">
      <motion.button
        onClick={handleClick}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer bg-main-1plus dark:bg-main hover:bg-main dark:hover:bg-main-1plus border border-[#C3C3C3] rounded-sidebar py-2 px-16 text-[14px] font-light"
      >
        Confirmar registro
      </motion.button>
    </div>
  );
};
