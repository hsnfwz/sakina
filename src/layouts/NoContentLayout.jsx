import { Link } from "react-router";

function NoContentLayout() {
  return (
    <div>
      <p>204 No Content</p>
      <Link to="/">Return home</Link>
    </div>
  );
}

export default NoContentLayout;
