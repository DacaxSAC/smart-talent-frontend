import { motion } from "framer-motion";

/**
 * Componente de botón reutilizable con animaciones y estilos consistentes
 * @param handleClick - Función que se ejecuta al hacer clic en el botón
 * @param text - Texto que se muestra en el botón
 * @param variant - Variante del estilo del botón ('primary' | 'secondary' | 'tertiary')
 * @param className - Clases CSS adicionales opcionales
 * @param disabled - Si el botón está deshabilitado
 * @param fullWidth - Si el botón debe ocupar todo el ancho disponible
 * @param justify - Justificación del contenedor ('start' | 'center' | 'end')
 */
export interface ReusableButtonProps {
  handleClick: () => void;
  text: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  justify?: 'start' | 'center' | 'end';
}

export const ReusableButton = ({
  handleClick,
  text,
  variant = 'primary',
  className = '',
  disabled = false,
  fullWidth = false,
  justify = 'end'
}: Readonly<ReusableButtonProps>) => {
  
  // Estilos base comunes para todos los botones
  const baseStyles = "cursor-pointer text-[14px] font-light border border-[#C3C3C3] rounded-sidebar py-2 px-16";
  
  // Estilos específicos por variante
  const variantStyles = {
    primary: "bg-main-1plus dark:bg-main hover:bg-main dark:hover:bg-main-1plus text-black dark:text-white",
    secondary: "bg-main rounded-[5px] px-10 py-1",
    tertiary: "bg-white-2 dark:bg-black-2 hover:bg-white-1 dark:hover:bg-black-1 border-medium"
  };
  
  // Estilos de justificación del contenedor
  const justifyStyles = {
    start: "justify-start",
    center: "justify-center", 
    end: "justify-end"
  };
  
  // Combinar todas las clases
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  const containerClasses = `flex ${justifyStyles[justify]} ${fullWidth ? 'w-full' : ''}`;
  
  return (
    <div className={containerClasses}>
      <motion.button
        onClick={disabled ? undefined : handleClick}
        whileHover={disabled ? {} : {
          scale: 1.01,
          transition: { duration: 0.2 },
        }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        className={buttonClasses}
        disabled={disabled}
      >
        {text}
      </motion.button>
    </div>
  );
};