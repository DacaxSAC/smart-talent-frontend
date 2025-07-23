export const AuthRequestMessage = ({
  text,
  isError = true
}: {
  text: string;
  isError: boolean;
}) => {
  return (
    <div className={`w-full mb-3 p-3  rounded-[12px] ${isError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
      <p className={isError ? 'text-error text-[12px]' : 'text-success text-[12px]'}>{text}</p>
    </div>
  );
};
