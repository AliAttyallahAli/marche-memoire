import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="160"
      height="40"
      viewBox="0 0 160 40"
      aria-label="TokenFlow logo"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <g transform="translate(0 2)">
          <path
            d="M20 36c11.046 0 20-8.954 20-20S31.046-4 20-4-4 4.954-4 16s8.954 20 20 20z"
            fill="hsl(var(--primary))"
          ></path>
          <path
            d="M20-4a20 20 0 100 40 20 20 0 000-40z"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            opacity="0.3"
          ></path>
          <path
            d="M18.5 24.5l-6.5-6.5a1 1 0 010-1.414l6.5-6.5a1 1 0 011.414 1.414L14.414 16l5.5 5.5a1 1 0 01-1.414 1.414L12 16.414l-4.086 4.086a1 1 0 01-1.414-1.414L12.086 13.5"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(4)"
          ></path>
        </g>
        <text
          x="48"
          y="27"
          fill="hsl(var(--foreground))"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="600"
          letterSpacing=".5"
        >
          TokenFlow
        </text>
      </g>
    </svg>
  );
}
