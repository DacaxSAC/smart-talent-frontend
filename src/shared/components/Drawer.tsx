import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DrawerProps {
  isActive: boolean;
  handleActive: () => void;
  children: React.ReactNode;
}

export const Drawer = ({ isActive, handleActive, children }: DrawerProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cierra el modal al hacer clic fuera y bloquea el scroll mientras está activo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutsideModal = modalRef.current && !modalRef.current.contains(event.target as Node);
      if (isClickOutsideModal) {
        handleActive();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    disableScroll(containerRef);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      enableScroll(containerRef);
    };
  }, [isActive, handleActive]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key="modal"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "tween",
              duration: 0.2,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black rounded-t-sidebar shadow-optionsmodal p-5 z-10 text-black dark:text-white border border-transparent dark:border-x-black-1 dark:border-t-black-1 font-karla overflow-hidden will-change-transform"
            ref={modalRef}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const disableScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  document.body.style.overflow = 'hidden';

  const parentElement = containerRef.current?.parentElement;
  if (parentElement) {
    parentElement.style.overflow = 'hidden';
  }
};

const enableScroll = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  document.body.style.overflow = 'unset';

  const parentElement = containerRef.current?.parentElement;
  if (parentElement) {
    parentElement.style.overflow = '';
  }
};

