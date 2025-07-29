export const PageTitle = ({title,description}:{title:string,description:string}) =>{
  return(
    <div className="flex flex-col text-start">
          <p className="text-[32px] dark:text-white md:text-[36px] xl:text-[36px]">
            {title}
          </p>
          <p className="text-[14px] font-light text-medium">
            {description}
          </p>
        </div>
  )
}