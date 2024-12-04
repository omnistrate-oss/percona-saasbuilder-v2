import { styleConfig } from "src/providerConfig";

const RemoveCapacityIcon = (props) => {
  let { color = styleConfig.dangerColor } = props;
  const { disabled, ...restProps } = props;

  if (disabled) {
    color = "#a3a6ac";
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <g clip-path="url(#clip0_344_520)">
        <path
          d="M6.66675 9.99999H13.3334M18.3334 9.99999C18.3334 14.6024 14.6025 18.3333 10.0001 18.3333C5.39771 18.3333 1.66675 14.6024 1.66675 9.99999C1.66675 5.39762 5.39771 1.66666 10.0001 1.66666C14.6025 1.66666 18.3334 5.39762 18.3334 9.99999Z"
          stroke={color}
          strokeWidth="1.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_344_520">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RemoveCapacityIcon;
