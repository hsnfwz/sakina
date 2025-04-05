import { useElementIntersection } from '../common/hooks.js';
import { useDiscussions } from '../common/hooks/discussions.js';
import Loaded from '../components/Loaded.jsx';
import Loading from '../components/Loading.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import Header from '../components/Header.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function Discussions() {
  const [elementRef, intersectingElement] = useElementIntersection();
  const [discussions, fetchingDiscussions] = useDiscussions(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Discussions</Header>
      <DiscussionCardGrid>
        {discussions.data.map((discussion, index) => (
          <DiscussionCard
            key={index}
            discussion={discussion}
            elementRef={
              index === discussions.data.length - 1 ? elementRef : null
            }
          />
        ))}
      </DiscussionCardGrid>
      {!discussions.hasMore && <Loaded />}
      {fetchingDiscussions && <Loading />}
    </div>
  );
}

export default Discussions;
