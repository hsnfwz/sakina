import { useContext } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import { useHomeDiscussions } from '../common/hooks/discussions.js';
import Loaded from '../components/Loaded.jsx';
import Loading from '../components/Loading.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import Header from '../components/Header.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function Discussions() {
  const { discussions } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [homeDiscussions, fetchingHomeDiscussions] =
    useHomeDiscussions(intersectingElement);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Discussions</Header>
      <DiscussionCardGrid>
        {homeDiscussions.keys.map((key, index) => (
          <DiscussionCard
            key={index}
            discussion={discussions.current[key]}
            elementRef={
              index === homeDiscussions.keys.length - 1 ? elementRef : null
            }
          />
        ))}
      </DiscussionCardGrid>
      {!homeDiscussions.hasMore && <Loaded />}
      {fetchingHomeDiscussions && <Loading />}
    </div>
  );
}

export default Discussions;
