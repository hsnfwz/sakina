import { useContext, Fragment } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { useElementIntersection } from '../common/hooks';
import { useUserDiscussions } from '../common/hooks/discussions.js';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function UserDiscussions() {
  const { authUser } = useContext(AuthContext);
  const { activeUser } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [userDiscussions, fetchingUserDiscussions] =
    useUserDiscussions(intersectingElement);

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
      {fetchingUserDiscussions && <Loading />}
    </div>
  );
}

export default UserDiscussions;
