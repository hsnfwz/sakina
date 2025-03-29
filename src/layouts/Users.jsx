import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { getUsers } from '../common/database/users.js';
import { useElementIntersection } from '../common/hooks.js';
import Loaded from '../components/Loaded.jsx';
import Loading from '../components/Loading.jsx';
import UserCard from '../components/UserCard.jsx';
import Header from '../components/Header.jsx';

function Users() {
  const { users, setUsers } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!users.hasInitialized) {
        await _getUsers();
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && users.hasMore) {
      _getUsers();
    }
  }, [intersectingElement]);

  async function _getUsers() {
    setIsLoading(true);

    const { data, hasMore } = await getUsers(users.data.length);

    const _users = { ...users };

    if (data.length > 0) {
      _users.data = [...users.data, ...data];
    }

    _users.hasMore = hasMore;

    if (!users.hasInitialized) {
      _users.hasInitialized = true;
    }

    setUsers(_users);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Users</Header>
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {users.data.map((user, index) => (
          <div key={index} className="w-full flex justify-center text-center">
            <UserCard
              user={user}
              elementRef={index === users.data.length - 1 ? elementRef : null}
            />
          </div>
        ))}
      </div>
      {!users.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default Users;
