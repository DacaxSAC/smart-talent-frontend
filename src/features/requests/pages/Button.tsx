import { motion } from "framer-motion";

interface LayoutPageProps {
    type: "primary" | "secondary";
    handleClick: () => void;
    show?: boolean;
    description: string;
}

export function Button({ type, show, handleClick, description }: LayoutPageProps) {
    const styles = {
        main: "py-2 px-8 text-[14px] font-light rounded-sidebar ",
        primary: "bg-main-1plus dark:bg-main hover:bg-main dark:hover:bg-main-1plus",
        secondary: "bg-white-2 dark:bg-black-2 hover:bg-white-1 dark:hover:bg-black-1 border border-medium"
    }

    if (show === false) return null;

    return (
        <motion.button
            whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            className={styles["main"] + styles[type]}
            onClick={handleClick}
        >
            {description}
        </motion.button>
    );
}