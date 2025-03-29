import Anchor from '../components/Anchor';

function ForbiddenLayout() {
  return (
    <div>
      <p>403 Forbidden</p>
      <Anchor to="/">Home</Anchor>
    </div>
  );
}

export default ForbiddenLayout;
