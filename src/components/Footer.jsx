import { Link } from "react-router";

function Footer() {
  return (
    <footer className="mt-auto flex w-full p-2 text-xs">
      <p>
        Designed and built by{" "}
        <Link
          target="_blank"
          className="underline hover:text-sky-500"
          to="https://www.linkedin.com/in/hsnfwz"
        >
          Hussein Fawaz
        </Link>
      </p>
    </footer>
  );
}

export default Footer;
