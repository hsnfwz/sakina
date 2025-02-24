import { Link, useLocation} from "react-router";

function NavPanel({ links }) {

  const location = useLocation();

  return (
    <div className="flex">
      {links.map((link, index) => (
        <div key={index}>
          {link.show && (
            <Link
              className={`${location.pathname === link.pathname || location.pathname.includes(link.to) ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
              to={link.to}
              state={link.state}
            >
              {link.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default NavPanel;
