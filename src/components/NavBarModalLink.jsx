import { NavLink } from "react-router";

function NavBarModalLink({ children, link, data, handleClick }) {
  return (
    <NavLink
      to={link}
      state={data}
      className={({ isActive }) =>
        isActive
          ? "block rounded-lg border border-transparent bg-sky-500 p-2 focus:border focus:border-white focus:outline-none focus:ring-0"
          : "block rounded-lg border border-transparent p-2 hover:bg-neutral-700 focus:border focus:border-white focus:outline-none focus:ring-0"
      }
      onClick={handleClick}
    >
      {children}
    </NavLink>
  );
}

export default NavBarModalLink;
