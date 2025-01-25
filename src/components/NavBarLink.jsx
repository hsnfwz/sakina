import { NavLink } from "react-router";

function NavBarLink({ children, link, data, handleClick }) {
  return (
    <NavLink
      to={link}
      state={data}
      className={({ isActive }) =>
        isActive
          ? " block rounded-full border border-transparent fill-sky-500 p-2 focus:border focus:border-white focus:outline-none focus:ring-0"
          : "block rounded-full border border-transparent fill-white p-2 hover:bg-neutral-700 focus:border focus:border-white focus:outline-none focus:ring-0"
      }
      onClick={() => handleClick}
    >
      {children}
    </NavLink>
  );
}

export default NavBarLink;
