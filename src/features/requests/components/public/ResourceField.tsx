import { useState, useRef } from 'react';
import { apiClient } from "@/lib/axios/client";
import { Notify } from "notiflix";
import { TrashIcon } from '@/shared/icons';

interface ResourceFieldProps {
    name: string;
    allowedFileTypes: string[] ;
    value?: string | File[] | null;
    onChange?: (value: File[] | string | null) => void;
    isEditable?: boolean;
    isResult?: boolean;
}

export const ResourceField = (props: ResourceFieldProps) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [textValue, setTextValue] = useState<string>(props.value as string || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFileReference = (value: string): boolean => {
        value = value == null ? '' : value;
        const fileExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.xls', '.xlsx', '.csv'];
        const hasExtension = fileExtensions.some(ext => value.toLowerCase().endsWith(ext));
        const hasPathSeparator = value.includes('/') || value.includes('\\');
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
        
        return hasExtension || hasPathSeparator || isUUID;
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        try {
            const response = await apiClient.post(`upload/read-signed-url`, {
                fileName: props.value,
            });
            
            if (response.status !== 200) {
                throw new Error('No se pudo obtener la URL firmada');
            }
            const signedUrl = response.data.signedUrl;
            window.open(signedUrl, '_blank');
        } catch (error) {
            console.error('Error al descargar el documento:', error);
            Notify.failure('Error al descargar el documento. Por favor, inténtelo de nuevo más tarde.');
        }
    };

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

            props.onChange?.(fileArray);
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setTextValue(value);
        props.onChange?.(value);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemove = () => {
        setSelectedFiles([]);
        setTextValue('');
        props.onChange?.(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getTooltipContent = () => {
        if (selectedFiles.length <= 1) return '';
        return selectedFiles.map(file => file.name).join('\n');
    };

    // Modo de solo lectura (Output)
    if (!props.isEditable) {
        const displayValue = props.value as string || '';
        
        return (
            <div className="flex py-2 items-start gap-4">
                <div className="text-[12px] text-medium w-48">
                    {props.name}
                </div>
                <div className="text-[12px] flex items-start gap-2 flex-1">
                    {isFileReference(displayValue) ? (
                        <button 
                            onClick={handleDownload}
                            className={`flex-1 px-3 py-0.5 border ${props.isResult ? 'border-black text-black hover:bg-white-2' : 'border-white-1 text-medium hover:bg-white-1'}  rounded-[4px] cursor-pointer`}
                        >
                            {textValue}
                        </button>
                    ) : (
                        <div className={`flex-1 px-3 py-0.5 border ${props.isResult ? 'border-black text-black' : 'border-white-1 text-medium'} rounded-[4px]`}
                        >
                            {displayValue || 'Pendiente'}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Modo de edición (Input)
    return (
        <div className="flex py-2 items-start gap-4">
            <div className="text-[12px] text-medium w-48">
                {props.name}
            </div>
            <div className="text-[12px] flex items-start gap-2 flex-1">
                {props.allowedFileTypes.length === 0 ? (
                    <textarea
                        placeholder=""
                        value={textValue}
                        onChange={handleTextChange}
                        rows={2}
                        className="flex-1 px-3 py-0.5 border border-gray-300 dark:border-gray-600 
                        rounded-[4px] focus:outline-none focus:ring-2 focus:ring-table-head focus:border-transparent 
                        bg-white dark:bg-gray-700  
                        placeholder-gray-400 dark:placeholder-gray-300
                        transition-all duration-200 resize-vertical"
                    />
                ) : (
                    <div className='w-full flex gap-2'>
                        <input
                            // onClick={handleDownload}
                            type="text"
                            placeholder="No hay archivo importado"
                            value={textValue}
                            readOnly
                            title={getTooltipContent()}
                            className="flex-1 px-3 py-0.5 border border-white-1 rounded-[4px] text-medium cursor-default focus:outline-none focus:ring-0 focus:border-white-1"
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
                            className="px-3 py-0.5 border border-black hover:bg-black hover:text-white rounded-[4px] cursor-pointer"
                        >
                            Subir archivo
                        </button>
                        {(selectedFiles.length > 0 || textValue) && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className=" text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 
                                    rounded-[4px] transition-colors duration-200 cursor-pointer"
                                title="Eliminar archivo"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};