import { useContext, useEffect, useState } from 'react';
import { getClipsByUserId } from '../common/database/clips.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import ContentTableGrid from '../components/ContentTableGrid.jsx';
import ContentTableCard from '../components/ContentTableCard.jsx';

function SettingsClips() {
  const { authUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);


  // TODO: pass this from the outlet in settings so we dont keep fetching when switching between subpages
  const [clips, setClips] = useState({
    data: [],
    hasMore: true,
    hasInitialized: false,
  });

  useEffect(() => {
    if (authUser) {
      if (!clips.hasInitialized) {

        getClips();
      }
    }
  }, [authUser]);

  async function getClips() {
    setIsLoading(true);

    const { data, hasMore } = await getClipsByUserId(
      authUser.id,
      clips.data.length
    );

    const _clips = { ...clips };

    if (data.length > 0) {
      _clips.data = [...clips.data, ...data];
    }

    _clips.hasMore = hasMore;

    if (!clips.hasInitialized) {
      _clips.hasInitialized = true;
    }

    setClips(_clips);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <ContentTableGrid>
      {clips.data.map((clip, index) => (
        <ContentTableCard key={index} content={clip} />
      ))}
      </ContentTableGrid>
      {!clips.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default SettingsClips;
