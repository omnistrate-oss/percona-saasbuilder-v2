const NodeIcon = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <mask
      id="mask0_522_1241"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <rect width={24} height={24} fill="url(#paint0_linear_522_1241)" />
    </mask>
    <g mask="url(#mask0_522_1241)">
      <circle cx="12" cy="12" r="11.5" fill="#F9F5FF" stroke="#E9D7FE" />
    </g>
    <rect width={24} height={24} rx={12} fill="#F7FAFE" />
    <path
      d="M15.3333 15.3333L18.6667 12L15.3333 8.66667M8.66667 8.66667L5.33333 12L8.66667 15.3333M13.3333 6L10.6667 18"
      stroke="#127AE8"
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_522_1241"
        x1={12}
        y1={0}
        x2={12}
        y2={24}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);
export default NodeIcon;
