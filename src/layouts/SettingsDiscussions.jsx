import { useContext, useEffect, useState } from 'react';
import { getDiscussionsByUserId } from '../common/database/discussions.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsDiscussions() {
  const { authUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);


  // TODO: pass this from the outlet in settings so we dont keep fetching when switching between subpages
  const [discussions, setDiscussions] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  useEffect(() => {
    if (authUser) {
      if (!discussions.hasInitialized) {

        getDiscussions();
      }
    }
  }, [authUser]);

  async function getDiscussions() {
    setIsLoading(true);

    const { data, hasMore } = await getDiscussionsByUserId(
      authUser.id,
      discussions.data.length
    );

    const _discussions = { ...discussions };

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
      <ContentTableGrid>
      {discussions.data.map((discussion, index) => (
        <ContentTableCard key={index} content={discussion} />
      ))}
      </ContentTableGrid>
      {!discussions.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsDiscussions;
