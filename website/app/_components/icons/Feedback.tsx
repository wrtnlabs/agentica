import { SVGAttributes } from "react";

export function FeedbackIcon(props: SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.00003 1.23636V1.99999H1.23639L2.00003 1.23636ZM14 1.99999L14.7637 2.00001V10.9997L14 11L14 11.7636H6.31633L2.54 15.54L1.23639 15V1.99999H2.00003V1.23636H14L14 1.99999ZM14 11L14 11.7636L14.7637 10.9997L14 11ZM13.2364 10.2364V2.76363H2.76366V13.1564L5.46005 10.46L6.00003 10.2364H13.2364ZM14.7637 2.00001L14 1.99999L14 1.23636L14.7637 2.00001Z"
        fill="#FAFAFA"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2364 8.23636H21.9997L22 9L22.7636 9.00002V22L21.46 22.54L17.6837 18.7636H10.0003L10 18L9.23637 18V14.2364H10.7636V17.2364H18L18.54 17.46L21.2364 20.1564V9.76364H17.2364V8.23636ZM10 18L9.23637 18L10.0003 18.7636L10 18ZM22 9L22.7636 9.00002L21.9997 8.23636L22 9Z"
        fill="#FAFAFA"
      />
    </svg>
  );
}
