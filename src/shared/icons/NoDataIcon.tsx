import { IconProps } from "./types";

/**
 * Icono para mostrar cuando no hay datos disponibles
 * @param width - Ancho del icono (por defecto 80)
 * @param height - Alto del icono (por defecto 80)
 * @param fill - Color de relleno (por defecto "none")
 * @param className - Clases CSS adicionales
 */
export const NoDataIcon: React.FC<IconProps> = ({ 
  width = 80, 
  height = 80, 
  fill = "none", 
  className 
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 80 80"
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8.33337 40C8.33337 25.0734 8.33337 17.6067 12.97 12.97C17.6067 8.33337 25.07 8.33337 40 8.33337C54.9267 8.33337 62.3934 8.33337 67.03 12.97C71.6667 17.6067 71.6667 25.07 71.6667 40M8.33337 40C8.33337 54.93 8.33337 62.3934 12.97 67.03C17.6067 71.6667 25.0734 71.6667 40 71.6667C54.93 71.6667 62.3934 71.6667 67.03 67.03C71.6667 62.3934 71.6667 54.9267 71.6667 40M8.33337 40H71.6667M43.3334 23.3334H56.6667"
      stroke="#A6A6A6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.5 27.5001C29.8012 27.5001 31.6667 25.6346 31.6667 23.3334C31.6667 21.0322 29.8012 19.1667 27.5 19.1667C25.1989 19.1667 23.3334 21.0322 23.3334 23.3334C23.3334 25.6346 25.1989 27.5001 27.5 27.5001Z"
      stroke="#A6A6A6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.5 60.8333C29.8012 60.8333 31.6667 58.9679 31.6667 56.6667C31.6667 54.3655 29.8012 52.5 27.5 52.5C25.1989 52.5 23.3334 54.3655 23.3334 56.6667C23.3334 58.9679 25.1989 60.8333 27.5 60.8333Z"
      stroke="#A6A6A6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M43.3334 56.6667H56.6667"
      stroke="#A6A6A6"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

