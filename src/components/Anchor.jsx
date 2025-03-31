import { Link } from 'react-router';

function Anchor({ children, to, state, active, elementRef, handleClick }) {
  return (
    <Link
      onClick={handleClick}
      ref={elementRef}
      to={to}
      state={state}
      onMouseDown={(event) => event.preventDefault()}
      className={`block w-full border-b-2 p-2 text-center hover:bg-neutral-200 focus:z-50 focus:rounded-lg focus:ring-2 focus:ring-black focus:outline-0 ${active ? 'border-sky-500 fill-sky-500 text-sky-500' : 'border-neutral-200 fill-black text-black'} flex items-center justify-center text-center`}
    >
      {children}
    </Link>
  );
}

export default Anchor;
