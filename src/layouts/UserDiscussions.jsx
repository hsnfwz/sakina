import { useContext, useEffect, useState } from 'react';
import { getDiscussionsByUserId } from '../common/database/discussions.js';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function UserDiscussions() {
  const { activeUser } = useContext(DataContext);

  const [isLoading, setIsLoading] = useState(false);

  const { userDiscussions, setUserDiscussions } = useContext(DataContext);

  useEffect(() => {
    if (activeUser) {
      if (!userDiscussions.hasInitialized) {
        getDiscussions();
      }
    }
  }, [activeUser]);

  async function getDiscussions() {
    setIsLoading(true);

    const { data, hasMore } = await getDiscussionsByUserId(
      activeUser.id,
      userDiscussions.data.length
    );

    const _userDiscussions = { ...userDiscussions };

    if (data.length > 0) {
      _userDiscussions.data = [...userDiscussions.data, ...data];
    }

    _userDiscussions.hasMore = hasMore;
    _userDiscussions.hasInitialized = true;

    setUserDiscussions(_userDiscussions);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <DiscussionCardGrid>
        {userDiscussions.data.map((discussion, index) => (
          <DiscussionCard key={index} discussion={discussion} />
        ))}
      </DiscussionCardGrid>
      {!userDiscussions.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default UserDiscussions;
