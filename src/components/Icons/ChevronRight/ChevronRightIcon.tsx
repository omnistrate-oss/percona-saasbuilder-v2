import { styleConfig } from "src/providerConfig";

const ChevronRightIcon = (props: any) => {
  const { color = styleConfig.linkColor } = props;
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 12L10 8L6 4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default ChevronRightIcon;
