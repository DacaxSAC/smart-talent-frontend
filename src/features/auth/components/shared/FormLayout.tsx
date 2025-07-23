/**
 * FormLayout component that provides a consistent layout for forms
 * @param children - Form elements to be rendered inside the layout
 * @param onSubmit - Form submission handler
 */
export const FormLayout = ({
    children,
    onSubmit
}: Readonly<{
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}>) => {
    return (
        <form className="w-full flex flex-col items-start gap-6" onSubmit={onSubmit}>
            {children}
        </form>
    );
};