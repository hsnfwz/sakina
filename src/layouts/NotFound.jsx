import { Link } from 'react-router';

function NotFound() {
  return (
    <div>
      <p>Whoops! We could not find what you were looking for.</p>
      <Link to="/">Return home</Link>
    </div>
  );
}

export default NotFound;
