import { ReactNode, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  TargetAndTransition,
  VariantLabels,
  Transition,
} from "framer-motion";
import CloseIcon from "../icons/CloseIcon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: "center" | "bottom" | "top";
  width?: string;
  height?: string;
  className?: string;
  showOverlay?: boolean;
  closeOnClickOutside?: boolean;
  title?: string;
  footer?: ReactNode;
  animation?: {
    initial?: TargetAndTransition | VariantLabels;
    animate?: TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
    transition?: Transition;
  };
}

const defaultAnimations = {
  center: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
    transition: { type: "spring", damping: 15, stiffness: 150 },
  },
  bottom: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
    transition: { type: "spring", damping: 15, stiffness: 150 },
  },
  top: {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
    transition: { type: "spring", damping: 15, stiffness: 150 },
  },
} as const;

export const Modal = ({
  isOpen,
  onClose,
  children,
  footer,
  title,
  position = "center",
  width = "auto",
  height = "auto",
  className = "",
  showOverlay = true,
  animation,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const selectedAnimation = animation || defaultAnimations[position];

  const getPositionStyles = () => {
    switch (position) {
      case "bottom":
        return "items-end";
      case "top":
        return "items-start";
      default:
        return "items-center";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-opacity z-40"
            />
          )}

          <div
            className={`fixed inset-0 flex justify-center ${getPositionStyles()} z-50`}
          >
            <motion.div
              ref={modalRef}
              style={{ width, height }}
              className={`max-h-[90vh] bg-white dark:bg-black rounded-lg shadow-sidebar dark:border dark:border-black-1 ${className} flex flex-col`} // <-- clave: flex-col aquí
              initial={selectedAnimation.initial}
              animate={selectedAnimation.animate}
              exit={selectedAnimation.exit}
              transition={selectedAnimation.transition}
            >
              <div className="flex flex-col dark:text-white flex-grow overflow-hidden py-3">
                {title && (
                  <div className="flex justify-between items-center border-b border-gray-300 px-3 pb-3">
                    <h3 className="text-black-2 dark:text-white text-[14px]">
                      {title}
                    </h3>
                    <button
                      onClick={onClose}
                      className="hover:text-main transition-colors cursor-pointer"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                )}

                <div className="flex-grow overflow-y-auto px-3 py-4">
                  {children}
                </div>

                {footer && (
                  <div className="flex justify-center px-3 pt-3 border-t border-gray-300">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
