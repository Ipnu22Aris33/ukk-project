import React from 'react';
import type { SVGProps } from 'react';

//line-md:menu-to-close-alt-transition
export default function LineMdMenuToCloseAltTransition(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={24}
      height={24}
      viewBox='0 0 24 24'
      {...props}
    >
      <g
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.4}
      >
        <path d='M5 5l14 14M5 19l14 -14'>
          <animate
            fill='freeze'
            attributeName='d'
            dur='0.4s'
            values='M5 5l14 0M5 19l14 0;M5 5l14 14M5 19l14 -14'
          ></animate>
        </path>
        <path d='M12 12h0'>
          <animate
            fill='freeze'
            attributeName='d'
            dur='0.4s'
            values='M5 12h14;M12 12h0'
          ></animate>
          <set fill='freeze' attributeName='opacity' begin='0.4s' to={0}></set>
        </path>
      </g>
    </svg>
  );
}
