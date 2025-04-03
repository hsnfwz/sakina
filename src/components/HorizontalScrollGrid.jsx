import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { BUTTON_COLOR } from '../common/enums';
import { useElementIntersection } from '../common/hooks';
import SVGOutlineRegularArrowRight from './svgs/outline/SVGOutlineRegularArrowRight';
import SVGOutlineArrowRight from './svgs/outline/SVGOutlineArrowRight';
import SVGOutlineArrowLeft from './svgs/outline/SVGOutlineArrowLeft';
import Button from './Button';

function HorizontalScrollGrid({ children, to }) {
  const [elementRef, intersectingElement] = useElementIntersection(1);
  const parentRef = useRef();
  const timerRef = useRef();
  const [scrollLeft, setScrollLeft] = useState(0);

  return (
    <div className="flex w-full flex-col gap-4">
      <div
        ref={parentRef}
        className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
        onScroll={() => {
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => {
            if (parentRef.current) {
              setScrollLeft(parentRef.current.scrollLeft);
            }
          }, 100);
        }}
      >
        {children}
        <Link
          ref={elementRef}
          to={to}
          onMouseDown={(event) => event.preventDefault()}
          className={`flex items-center justify-center self-center rounded-full border-2 border-sky-500 bg-sky-500 fill-white p-2 text-center transition-all hover:bg-sky-700 focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
        >
          <SVGOutlineRegularArrowRight />
        </Link>
      </div>
      <div className="flex gap-2 self-end">
        <Button
          color={BUTTON_COLOR.SOLID_GREEN}
          isDisabled={scrollLeft === 0}
          handleClick={() => {
            parentRef.current.scrollBy({ left: -1, behavior: 'smooth' });
            setScrollLeft(parentRef.current.scrollLeft);
          }}
        >
          <SVGOutlineArrowLeft />
        </Button>
        <Button
          color={BUTTON_COLOR.SOLID_GREEN}
          isDisabled={intersectingElement}
          handleClick={() => {
            parentRef.current.scrollBy({ left: 1, behavior: 'smooth' });
            setScrollLeft(parentRef.current.scrollLeft);
          }}
        >
          <SVGOutlineArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default HorizontalScrollGrid;
