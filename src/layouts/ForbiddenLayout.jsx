import { Link } from "react-router";

function ForbiddenLayout() {
  return (
    <div>
      <p>403 Forbidden</p>
      <Link to="/">Return home</Link>
    </div>
  );
}

export default ForbiddenLayout;
