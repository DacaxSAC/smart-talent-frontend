export const FormLayout = ({
    children
}: Readonly<{
    children: React.ReactNode
    }>)=>{
    return (
    <div className="w-full flex flex-col items-start gap-6">
        {children}
    </div>
    );
}