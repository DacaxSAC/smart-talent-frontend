export const FormInput = ({
  fieldName,
  value,
  handleOnChange,
  error,
  errorMessage,
  disabled,
}:Readonly<{
  fieldName: string;
  value: string;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}>) => {
  return (
    <div className="flex flex-col md:flex-row gap-1 md:gap-4">
      <label className="min-w-[120px]">{fieldName}</label>
      <div className="flex-1 flex flex-col">
        <input
          value={value}
          onChange={handleOnChange}
          type="text"
          disabled={disabled}
          className={`border ${error ? 'border-red-500' : 'border-white-1'} py-0.5 px-2 rounded flex-1 outline-main-2plus ${
            disabled ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed' : ''
          }`}
        />
        {error && errorMessage && (
          <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
        )}
      </div>
    </div>
  );
};
