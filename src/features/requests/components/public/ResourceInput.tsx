import { useState, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';

interface ResourceInputProps {
    name: string;
    allowedFileTypes: string[];
    onChange: (value: File[] | string | null) => void;
}

export const ResourceInput = (props: ResourceInputProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [textValue, setTextValue] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const fileArray = Array.from(files);
            setSelectedFiles(fileArray);

            if (fileArray.length === 1) {
                setTextValue(fileArray[0].name);
            } else {
                setTextValue(`${fileArray.length} archivos seleccionados`);
            }

            props.onChange(fileArray);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setTextValue(value);
        props.onChange(value);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        setSelectedFiles([]);
        setTextValue('');
        props.onChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getTooltipContent = () => {
        if (selectedFiles.length <= 1) return '';
        return selectedFiles.map(file => file.name).join('\n');
    };

    return (
        <div className="flex py-[14px] items-start gap-4">
            <div className="text-[16px] text-black-2 dark:text-white w-68">
                {props.name}
            </div>
            <div className="flex items-start gap-2 flex-1">
                {props.allowedFileTypes.length === 0 ? (
                    <textarea
                        placeholder=""
                        value={textValue}
                        onChange={handleTextChange}
                        rows={3}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                        rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                        placeholder-gray-400 dark:placeholder-gray-300
                        transition-all duration-200 resize-vertical"
                    />
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="No hay archivo importado"
                            value={textValue}
                            readOnly
                            title={getTooltipContent()}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                            rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white 
                            placeholder-gray-400 dark:placeholder-gray-300
                            cursor-default"
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={props.allowedFileTypes.join(',')}
                            onChange={handleFileChange}
                            multiple
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="px-4 py-2 text-sm bg-gray-800 dark:bg-gray-700 text-white rounded-md 
                                hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200
                                border border-gray-300 dark:border-gray-600"
                        >
                            Subir archivo
                        </button>
                        {(selectedFiles.length > 0 || textValue) && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 
                                    rounded-md transition-colors duration-200"
                                title="Eliminar archivo"
                            >
                                <FaTrash className="w-4 h-4" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};