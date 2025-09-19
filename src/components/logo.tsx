import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      aria-label="ZOUDOU logo"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <rect width="40" height="40" rx="8" fill="hsl(var(--primary))" />
        <text
          x="50%"
          y="52%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="hsl(var(--primary-foreground))"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="bold"
        >
          Z
        </text>
      </g>
    </svg>
  );
}
