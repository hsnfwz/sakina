import { Link } from "react-router";

function NotFoundLayout() {
  return (
    <div>
      <p>404 Not Found</p>
      <Link to="/">Return home</Link>
    </div>
  );
}

export default NotFoundLayout;
