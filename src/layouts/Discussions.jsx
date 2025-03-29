import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import { getDiscussions } from '../common/database/discussions.js';
import Loaded from '../components/Loaded.jsx';
import Loading from '../components/Loading.jsx';
import DiscussionCard from '../components/DiscussionCard.jsx';
import Header from '../components/Header.jsx';
import DiscussionCardGrid from '../components/DiscussionCardGrid.jsx';

function Discussions() {
  const { discussions, setDiscussions } = useContext(DataContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!discussions.hasInitialized) {
        await _getDiscussions();
      }
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && discussions.hasMore) {
      _getDiscussions();
    }
  }, [intersectingElement]);

  async function _getDiscussions() {
    setIsLoading(true);

    const { data, hasMore } = await getDiscussions(discussions.data.length);

    const _discussions = {
      ...discussions,
    };

    if (data.length > 0) {
      _discussions.data = [...discussions.data, ...data];
    }

    _discussions.hasMore = hasMore;

    if (!discussions.hasInitialized) {
      _discussions.hasInitialized = true;
    }

    setDiscussions(_discussions);

    setIsLoading(false);
  }

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
      {isLoading && <Loading />}
    </div>
  );
}

export default Discussions;
