import React from 'react';

import type { SVGProps } from 'types/SVGProps';

const Calendar = (props: SVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="48"
      height="48"
      viewBox="0 0 172 172"
      {...props}
    >
      <g transform="">
        <g
          fill="none"
          fillRule="nonzero"
          stroke="none"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          strokeDasharray=""
          strokeDashoffset="0"
        >
          <path d="M0,172v-172h172v172z" fill="none"></path>
          <g fill="#2ecc71">
            <path d="M41.28,0c-3.7625,0 -6.88,3.1175 -6.88,6.88v6.88h-20.64c-1.80062,0 -3.62812,0.65844 -4.91812,1.96188c-1.30344,1.29 -1.96188,3.1175 -1.96188,4.91812v137.6c0,1.80063 0.65844,3.62813 1.96188,4.93156c1.29,1.29 3.1175,1.94844 4.91812,1.94844h144.48c1.80063,0 3.62813,-0.65844 4.93156,-1.94844c1.29,-1.30344 1.94844,-3.13094 1.94844,-4.93156v-137.6c0,-1.80062 -0.65844,-3.62812 -1.94844,-4.91812c-1.30344,-1.30344 -3.13094,-1.96188 -4.93156,-1.96188h-20.64v-6.88c0,-3.7625 -3.1175,-6.88 -6.88,-6.88h-6.88c-3.7625,0 -6.88,3.1175 -6.88,6.88v6.88h-61.92v-6.88c0,-3.7625 -3.1175,-6.88 -6.88,-6.88zM41.28,6.88h6.88v20.64h-6.88zM123.84,6.88h6.88v20.64h-6.88zM13.76,20.64h20.64v6.88c0,3.7625 3.1175,6.88 6.88,6.88h6.88c3.7625,0 6.88,-3.1175 6.88,-6.88v-6.88h61.92v6.88c0,3.7625 3.1175,6.88 6.88,6.88h6.88c3.7625,0 6.88,-3.1175 6.88,-6.88v-6.88h20.64v24.08h-144.48zM13.76,51.6h144.48v106.64h-144.48zM34.4,65.36v79.12h103.2v-79.12zM41.28,72.24h17.2v17.2h-17.2zM65.36,72.24h17.2v17.2h-17.2zM89.44,72.24h17.2v17.2h-17.2zM113.52,72.24h17.2v17.2h-17.2zM41.28,96.32h17.2v17.2h-17.2zM65.36,96.32h17.2v17.2h-17.2zM89.44,96.32h17.2v17.2h-17.2zM113.52,96.32h17.2v17.2h-17.2zM41.28,120.4h17.2v17.2h-17.2zM65.36,120.4h17.2v17.2h-17.2zM89.44,120.4h17.2v17.2h-17.2zM113.52,120.4h17.2v17.2h-17.2z"></path>
          </g>
          <path d="" fill="none"></path>
        </g>
      </g>
    </svg>
  );
};

export default Calendar;
