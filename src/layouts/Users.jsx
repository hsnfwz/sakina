import { useContext } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import { useViewAllUsers } from '../common/hooks/users.js';
import Loaded from '../components/Loaded.jsx';
import Loading from '../components/Loading.jsx';
import UserCard from '../components/UserCard.jsx';
import Header from '../components/Header.jsx';
import UserCardGrid from '../components/UserCardGrid.jsx';

function Users() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const { users } = useContext(DataContext);
  const [viewAllUsers, fetchingViewAllUsers] =
    useViewAllUsers(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Users</Header>
      <UserCardGrid>
        {viewAllUsers.keys.map((key, index) => (
          <UserCard
            key={index}
            user={users.current[key]}
            elementRef={
              index === viewAllUsers.keys.length - 1 ? elementRef : null
            }
          />
        ))}
      </UserCardGrid>
      {!viewAllUsers.hasMore && <Loaded />}
      {fetchingViewAllUsers && <Loading />}
    </div>
  );
}

export default Users;
