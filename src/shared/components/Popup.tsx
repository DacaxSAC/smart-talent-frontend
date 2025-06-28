import { useRef, useEffect } from "react";

interface DocsChecklistProps {
  isOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
}

export const Popup = ({ isOpen, handleClose, children }: DocsChecklistProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      if (isOpen) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      ref={modalRef} 
      className="w-52 absolute top-full right-10 mt-1 z-10"
    >
      <div className="flex flex-col gap-1 bg-white dark:bg-black rounded-[4px] shadow-doc-options border border-white-1 dark:border-black-2">
        {children}
      </div>
    </div>
  );
};
