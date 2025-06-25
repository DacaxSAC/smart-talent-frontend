import { motion } from "framer-motion";

interface LayoutPageProps {
    handleClick: () => void;
    show: boolean;
    description: string;
}

export function Button({ show, handleClick, description }: LayoutPageProps) {
    if (!show) return null;

    return (
        <motion.button
            whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-main-1plus dark:bg-main hover:bg-main dark:hover:bg-main-1plus rounded-sidebar py-2 px-8 text-[14px] font-light"
            onClick={handleClick}
        >
            {description}
        </motion.button>
    );
}
