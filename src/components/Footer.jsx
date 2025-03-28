import { Link } from "react-router";

function Footer() {

  return (
    <footer className="w-full flex flex-col gap-2 p-2">
      <Link to="/">Sakina</Link>
      <p>Copyright 2025 Sakina</p>
    </footer>
  );
}

export default Footer;
