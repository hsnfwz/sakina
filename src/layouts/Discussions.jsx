import { useContext } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import { useViewAllDiscussions } from '../common/hooks/discussions.js';
import Loaded from '../components/Loaded.jsx';
import Loading from '../components/Loading.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import Header from '../components/Header.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function Discussions() {
  const { discussions } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [viewAllDiscussions, fetchingViewAllDiscussions] =
    useViewAllDiscussions(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Discussions</Header>
      <DiscussionCardGrid>
        {viewAllDiscussions.keys.map((key, index) => (
          <DiscussionCard
            key={index}
            discussion={discussions.current[key]}
            elementRef={
              index === viewAllDiscussions.keys.length - 1 ? elementRef : null
            }
          />
        ))}
      </DiscussionCardGrid>
      {!viewAllDiscussions.hasMore && <Loaded />}
      {fetchingViewAllDiscussions && <Loading />}
    </div>
  );
}

export default Discussions;
