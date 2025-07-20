export const FormButton = ({
    text,
    disabled,
    onClick
}:Readonly<{
    text:string,
    disabled:boolean,
    onClick:()=>void
}>) =>{
    return(
        <button 
            type="button"
            onClick={onClick}
            className="
                text-[20px] text-center
                bg-main 
                hover:opacity-80 
                border border-medium
                rounded-[15px] 
                px-4 py-2 
                mt-6 
                w-full 
                cursor-pointer"
            disabled={disabled}
        >
            {text}
        </button>
    );
}