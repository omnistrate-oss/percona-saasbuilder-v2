import * as React from "react";
const Signoz = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={0.5} y={0.5} width={23} height={23} rx={11.5} fill="white" />
    <rect x={0.5} y={0.5} width={23} height={23} rx={11.5} stroke="#FF613C" />
    <path
      opacity={0.9}
      d="M12.0167 17.8025C8.67409 17.8025 6 15.1797 6 11.9012C6 8.65556 8.67409 6 12.0167 6H15.7939C17.0306 6 18 6.98354 18 8.16379V11.9012C18 15.1797 15.3259 17.8025 12.0167 17.8025Z"
      fill="#F25733"
    />
    <path
      d="M11.9695 9.34668C9.47282 9.34668 8.0665 11.4141 8.00785 11.5021C7.86325 11.7189 7.86325 11.9993 8.00796 12.2163C8.0665 12.3041 9.47282 14.3716 11.9695 14.3716C14.4662 14.3716 15.8726 12.3041 15.9312 12.2161C16.0758 11.9993 16.0758 11.7189 15.9311 11.502C15.8726 11.4141 14.4662 9.34668 11.9695 9.34668ZM8.35343 11.9858C8.30209 11.9088 8.30209 11.8094 8.35343 11.7324C8.4006 11.6616 9.40189 10.1909 11.1921 9.83805C10.3809 10.1512 9.8036 10.9388 9.8036 11.8591C9.8036 12.7795 10.3809 13.567 11.1921 13.8802C9.40189 13.5274 8.4006 12.0566 8.35343 11.9858ZM10.9714 11.8591C10.9714 11.9738 10.8785 12.0667 10.7638 12.0667C10.6491 12.0667 10.5561 11.9738 10.5561 11.8591C10.5561 11.0798 11.1902 10.4457 11.9695 10.4457C12.0842 10.4457 12.1771 10.5387 12.1771 10.6534C12.1771 10.7681 12.0842 10.861 11.9695 10.861C11.4192 10.861 10.9714 11.3088 10.9714 11.8591ZM11.9695 12.3639C11.6912 12.3639 11.4647 12.1375 11.4647 11.8591C11.4647 11.5808 11.6912 11.3543 11.9695 11.3543C12.2479 11.3543 12.4744 11.5807 12.4744 11.8591C12.4744 12.1375 12.2479 12.3639 11.9695 12.3639ZM15.5856 11.9858C15.5385 12.0566 14.5372 13.5274 12.747 13.8802C13.5583 13.567 14.1355 12.7795 14.1355 11.8591C14.1355 10.9388 13.5583 10.1512 12.747 9.83806C14.5372 10.1909 15.5385 11.6617 15.5856 11.7324C15.637 11.8094 15.637 11.9088 15.5856 11.9858Z"
      fill="#F9F2F9"
    />
  </svg>
);
export default Signoz;