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
      id="mask0_3136_10291"
      style={{
        maskType: "alpha",
      }}
      maskUnits="userSpaceOnUse"
      x={0}
      y={0}
      width={24}
      height={24}
    >
      <rect width={24} height={24} fill="url(#paint0_linear_3136_10291)" />
    </mask>
    <g mask="url(#mask0_3136_10291)">
      <circle cx={12} cy={12} r={11.5} fill="#F9F5FF" stroke="#0B4A8C" />
    </g>
    <rect width={24} height={24} rx={12} fill="#127AE8" fillOpacity={0.04} />
    <path
      d="M15.3334 15.3333L18.6667 12L15.3334 8.66667M8.66671 8.66667L5.33337 12L8.66671 15.3333M13.3334 6L10.6667 18"
      stroke="#0B4A8C"
      strokeWidth={1.33}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_3136_10291"
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
