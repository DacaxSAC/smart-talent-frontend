import { IconProps } from "./types";

export const DocTerminatedIcon: React.FC<IconProps> = ({
  width = 30,
  height = 30,
  className = "text-black dark:text-white"
}) => {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_453_3188)">
        <path d="M15.0413 15.0532H6.33301C5.89759 15.0532 5.52498 14.8983 5.21517 14.5885C4.90537 14.2787 4.7502 13.9058 4.74967 13.4699V2.38656C4.74967 1.95114 4.90484 1.57853 5.21517 1.26872C5.52551 0.958917 5.89812 0.80375 6.33301 0.803223H11.8747L16.6247 5.55322V13.4699C16.6247 13.9053 16.4698 14.2782 16.16 14.5885C15.8502 14.8988 15.4773 15.0538 15.0413 15.0532ZM11.083 6.34489V2.38656H6.33301V13.4699H15.0413V6.34489H11.083ZM3.16634 18.2199C2.73092 18.2199 2.35831 18.065 2.04851 17.7552C1.7387 17.4454 1.58354 17.0725 1.58301 16.6366V5.55322H3.16634V16.6366H11.8747V18.2199H3.16634Z" fill="#A6A6A6" />
      </g>
      <defs>
        <clipPath id="clip0_453_3188">
          <rect width="19" height="19" fill="white" transform="translate(0 0.0117188)" />
        </clipPath>
      </defs>
    </svg>

  );
};

