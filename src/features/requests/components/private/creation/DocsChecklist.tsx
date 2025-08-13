import { Checkbox } from "@/shared/components/checkbox";
import { Fragment } from "react";
import { RequestsType } from "@/features/requests/types/RequestsListType";
import { useDocumentType } from '@/features/requests/hooks/useDocumentType';
import { IDocumentType } from "@/features/requests/interfaces/IDocumentTypeResponse";
import { Popup } from "@/shared/components/Popup";

interface DocsChecklistProps {
  request: RequestsType;
  index: number;
  open: boolean;
  handleDocCheckbox: (rowIndex: number, doc: IDocumentType, checked: boolean) => void;
  handleOpen: () => void;
}

export const DocsChecklist = ({ request, index, open, handleDocCheckbox, handleOpen }: DocsChecklistProps) => {
  const { documentTypes } = useDocumentType();

  return (
    <Popup isOpen={open} handleClose={handleOpen}>
      <Fragment>
        {documentTypes.map((option, optIdx) => (
          <CheckItem
            key={optIdx}
            index={optIdx}
            item={option}
            checked={request.documents.some(doc => doc.documentTypeId === option.id)}
            handleCheck={(checked: boolean) => handleDocCheckbox(index, option, checked)}
          />
        ))}
      </Fragment>
    </Popup>
  );
};

interface CheckItemProps {
  index: number;
  item: IDocumentType;
  checked: boolean;
  handleCheck: (checked: boolean) => void;
}

const CheckItem = ({ item, checked, handleCheck }: CheckItemProps) => (
  <div
    className="flex justify-between items-center gap-4 p-2 cursor-pointer border-b border-white-1 dark:border-black-2 last:border-b-0"
    onClick={(e) => e.stopPropagation()}
  >
    <span>{item.name}</span>
    <Checkbox checked={checked} onCheckedChange={handleCheck} />
  </div>
);
