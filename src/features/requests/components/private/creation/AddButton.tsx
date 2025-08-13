import { motion } from "framer-motion";
import { ReactNode } from "react";
import { GoPlus } from "react-icons/go";

interface AddButtonProps {
  type: "document" | "request"
  onClick: () => void
  children?: ReactNode
}

export const AddButton = ({ type, onClick, children }: AddButtonProps) =>{
    return(
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className={`flex cursor-pointer bg-white dark:bg-transparent border border-black dark:border-white rounded-[5px] ${type=== 'document'? 'ml-auto':''}`}
          onClick={onClick}
        >
          {children && <span className='ml-1'>{children}</span>}
          <GoPlus className={`${type=== 'document'?'w-[20px] h-[20px]':'w-[25px] h-[25px]'}`} />
        </motion.button>
    );
}