import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@/shared/icons';

/**
 * FormInput component with password visibility toggle functionality
 * @param children - Optional child elements to render below the input
 * @param text - Label text for the input
 * @param type - Input type (text, password, email, etc.)
 * @param error - Error message to display, null if no error
 * @param handleError - Function to handle input changes and clear errors
 */
export const FormInput = ({
    children,
    value,
    type,
    labelValue,
    handleChange
}: Readonly<{
    children?: React.ReactNode,
    value: string,
    type: 'email'|'password'
    labelValue: string,
    handleChange:(e:React.ChangeEvent<HTMLInputElement>) => void
}>) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    
    /**
     * Toggle password visibility
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    // Determine the actual input type based on password visibility
    const inputType = isPasswordField && showPassword ? 'text' : type;
    
    return (
        <div className="flex flex-col w-full gap-4">
            <label>{labelValue}</label>
            <div className="relative">
                <input 
                    type={inputType} 
                    value={value} 
                    onChange={handleChange} 
                    className={`bg-input dark:bg-black-2 border border-medium rounded-[12px] h-10 px-4 py-2 w-full ${
                        isPasswordField ? 'pr-12' : ''
                    } `} 
                />
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-2 dark:text-neutral-4 hover:text-neutral-1 dark:hover:text-neutral-3 transition-colors"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? (
                            <EyeOffIcon width={20} height={20} />
                        ) : (
                            <EyeIcon width={20} height={20} />
                        )}
                    </button>
                )}
            </div>
            {children}
        </div>
    );
};