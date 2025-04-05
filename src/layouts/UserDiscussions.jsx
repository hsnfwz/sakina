import { useContext, useEffect, useState, Fragment } from 'react';
import { getDiscussionsByUserId } from '../common/database/discussions.js';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function UserDiscussions() {
  const { authUser } = useContext(AuthContext);
  const { activeUser } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const { userDiscussions, setUserDiscussions } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeUser) {
      if (!userDiscussions.hasInitialized) {
        getDiscussions();
      }
    }
  }, [activeUser]);

  useEffect(() => {
    if (intersectingElement && userDiscussions.hasMore) {
      getDiscussions();
    }
  }, [intersectingElement]);

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
          <Fragment key={index}>
            {(!discussion.is_anonymous ||
              (discussion.is_anonymous &&
                authUser &&
                activeUser &&
                authUser.id === activeUser.id)) && (
              <DiscussionCard
                key={index}
                discussion={discussion}
                elementRef={
                  index === userDiscussions.data.length - 1 ? elementRef : null
                }
              />
            )}
          </Fragment>
        ))}
      </DiscussionCardGrid>
      {!userDiscussions.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default UserDiscussions;
