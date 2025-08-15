import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LayoutPageProps {
    type: "primary" | "secondary";
    handleClick: () => void;
    show?: boolean;
    description?: string;
    children?: ReactNode;
    disabled?: boolean;
}

/**
 * Componente Button reutilizable con soporte para estados disabled y contenido personalizado
 * @param type - Estilo del botón (primary o secondary)
 * @param handleClick - Función a ejecutar al hacer clic
 * @param show - Controla la visibilidad del botón
 * @param description - Texto del botón (opcional si se usa children)
 * @param children - Contenido personalizado del botón
 * @param disabled - Estado deshabilitado del botón
 */
export function Button({ type, show, handleClick, description, children, disabled = false }: LayoutPageProps) {
    const styles = {
        main: "py-2 px-8 text-[14px] font-light rounded-sidebar ",
        primary: "bg-main-1plus dark:bg-main hover:bg-main dark:hover:bg-main-1plus",
        secondary: "bg-white-2 dark:bg-black-2 hover:bg-white-1 dark:hover:bg-black-1 border border-medium text-black dark:text-white",
        disabled: "opacity-50 cursor-not-allowed"
    }

    if (show === false) return null;

    const buttonClass = `${styles.main}${styles[type]}${disabled ? ` ${styles.disabled}` : ""}`;

    return (
        <motion.button
            whileHover={disabled ? {} : {
                scale: 1.01,
                transition: { duration: 0.2 },
            }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={buttonClass}
            onClick={disabled ? undefined : handleClick}
            disabled={disabled}
        >
            {children || description}
        </motion.button>
    );
}