interface LayoutPageProps {
    title: string;
    description: string;
    buttonsHeader?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

export function LayoutPage({ title, description, buttonsHeader, footer, children }: LayoutPageProps) {
    return (
        <div className="h-screen flex flex-col px-5 md:px-8 py-8 gap-11 font-light">
            <div
                className="
                    flex flex-row justify-between items-center
                    w-full mt-5 md:mt-0
                    text-black dark:text-white"
            >
                <div>
                    <p className="font-karla text-[32px] md:text-[36px] xl:text-[36px]">
                        {title}
                    </p>
                    <p className="text-[12px] font-light">
                        {description}
                    </p>
                </div>

                {buttonsHeader && (
                    <div className="flex justify-end gap-3">
                        {buttonsHeader}
                    </div>
                )}
            </div>

            <div className="w-full flex-1 p-3 rounded-sidebar shadow-doc-options bg-white dark:bg-black dark:border dark:border-black-1 text-[12px] overflow-x-auto relative">
                {children}
            </div>

            {footer}
        </div>
    );
}
