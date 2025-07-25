interface IconProps extends React.SVGProps<SVGSVGElement> {}

const CloseIcon: React.FC<IconProps> = (props) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 7.32227L17 17.3223M7 17.3223L17 7.32227"
        stroke="#101010"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
