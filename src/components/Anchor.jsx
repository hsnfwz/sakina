import { Link } from 'react-router';

function Anchor({ children, to, state, active, elementRef, handleClick, isRounded }) {
  return (
    <Link
      onClick={handleClick}
      ref={elementRef}
      to={to}
      state={state}
      onMouseDown={(event) => event.preventDefault()}
      className={`block w-full border-b-2 ${isRounded ? 'p-1' : 'px-2 py-1'} text-center hover:bg-neutral-100 ${active ? 'border-sky-500 fill-sky-500 text-sky-500' : 'border-neutral-100 fill-black text-black'} flex items-center justify-center text-center transition-all focus:z-50 focus:border-black focus:bg-white focus:ring-0 focus:outline-0`}
    >
      {children}
    </Link>
  );
}

export default Anchor;
