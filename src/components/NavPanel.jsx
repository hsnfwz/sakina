import { Link, useLocation } from 'react-router';

function NavPanel({ links }) {
  const location = useLocation();

  return (
    <div className="flex w-full py-2">
      <div className="flex w-full gap-2">
        {links.map((link, index) => (
          <div key={index}>
            {link.show && (
              <Link
                className={`block ${location.pathname === link.pathname || location.pathname.includes(link.to) || location.hash === link.hash ? 'border-b-sky-500 border-t-transparent' : 'border-y-transparent'} border-y-2 py-2 hover:border-b-sky-500`}
                to={link.to}
                state={link.state}
              >
                {link.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NavPanel;
