import type { SVGProps } from 'react';

//line-md:close-to-menu-alt-transition
export default function LineMdCloseToMenuAltTransition(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      {...props}
    >
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.4}
        d='M5 5l14 0M5 19l14 0M5 12h14'
      >
        <animate
          fill='freeze'
          attributeName='d'
          dur='0.4s'
          values='M5 5l14 14M5 19l14 -14M12 12h0;M5 5l14 0M5 19l14 0M5 12h14'
        ></animate>
      </path>
    </svg>
  );
}
