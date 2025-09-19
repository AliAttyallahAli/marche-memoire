import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="150"
      height="40"
      viewBox="0 0 150 40"
      aria-label="ZOUDOU logo"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path
          d="M16 8a8 8 0 110 16 8 8 0 010-16zM24.5 24.5a8 8 0 110-16 8 8 0 010 16zM33 32a8 8 0 110-16 8 8 0 010 16z"
          fill="hsl(var(--primary))"
          opacity="0.7"
        ></path>
        <text
          x="48"
          y="27"
          fill="hsl(var(--sidebar-foreground))"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="600"
          letterSpacing=".5"
        >
          ZOUDOU
        </text>
      </g>
    </svg>
  );
}
