import { useEffect, useState, useRef, useContext } from 'react';
import { Link } from 'react-router';

import { getVideos } from '../common/database/videos';
import { getClips } from '../common/database/clips';
import { getUsers } from '../common/database/users';
import { getDiscussions } from '../common/database/discussions';
import { useElementIntersection } from '../common/hooks';
import VideoCard from '../components/VideoCard';
import ClipCard from '../components/ClipCard';
import UserCard from '../components/UserCard';
import DiscussionCard from '../components/DiscussionCard';
import Button from '../components/Button';
import SVGOutlineArrowLeft from '../components/svgs/outline/SVGOutlineArrowLeft';
import SVGOutlineArrowRight from '../components/svgs/outline/SVGOutlineArrowRight';
import SVGOutlineRegularArrowRight from '../components/svgs/outline/SVGOutlineRegularArrowRight';
import Loading from '../components/Loading';
import Header from '../components/Header';
import { BUTTON_COLOR } from '../common/enums';
import { DataContext } from '../common/context/DataContextProvider';

function Explore() {
  const [usersFirstRef, usersFirstElementIsIntersecting] =
    useElementIntersection();
  const [usersLastRef, usersLastElementIsIntersecting] =
    useElementIntersection();
  const [videosFirstRef, videosFirstElementIsIntersecting] =
    useElementIntersection();
  const [videosLastRef, videosLastElementIsIntersecting] =
    useElementIntersection();
  const [clipsFirstRef, clipsFirstElementIsIntersecting] =
    useElementIntersection();
  const [clipsLastRef, clipsLastElementIsIntersecting] =
    useElementIntersection();
  const [discussionsFirstRef, discussionsFirstElementIsIntersecting] =
    useElementIntersection();
  const [discussionsLastRef, discussionsLastElementIsIntersecting] =
    useElementIntersection();

  const {
    users, setUsers,
    videos, setVideos,
    clips, setClips,
    discussions, setDiscussions
  } = useContext(DataContext);

  const usersRef = useRef();
  const videosRef = useRef();
  const clipsRef = useRef();
  const discussionsRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!users.hasInitialized) {
        console.log('hi');

        setIsLoading(true);

        const [
          videosResponse,
          clipsResponse,
          usersResponse,
          discussionsResponse,
        ] = await Promise.all([
          getVideos(),
          getClips(),
          getUsers(),
          getDiscussions(),
        ]);

        setVideos({ data: videosResponse.data, hasInitialized: true });
        setClips({ data: clipsResponse.data, hasInitialized: true });
        setUsers({ data: usersResponse.data, hasInitialized: true });
        setDiscussions({ data: discussionsResponse.data, hasInitialized: true });

        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <Header>Users</Header>
          {users.data.length > 0 && (
            <div
              ref={usersRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {users.data.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  elementRef={index === 0 ? usersFirstRef : null}
                />
              ))}
              <Link
                to="/users"
                ref={usersLastRef}
                className="bg-sky-500 border-sky-500 hover:bg-sky-700 flex snap-start self-center rounded-lg border-2 fill-white p-1 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={usersFirstElementIsIntersecting}
              handleClick={() => {
                usersRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowLeft />
            </Button>
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={usersLastElementIsIntersecting}
              handleClick={() => {
                usersRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowRight />
            </Button>
          </div>

          <Header>Videos</Header>
          {videos.data.length > 0 && (
            <div
              ref={videosRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {videos.data.map((video, index) => (
                <VideoCard
                  key={index}
                  video={video}
                  elementRef={index === 0 ? videosFirstRef : null}
                />
              ))}
              <Link
                to="/videos"
                ref={videosLastRef}
                className="bg-sky-500 border-sky-500 hover:bg-sky-700 flex snap-start self-center rounded-lg border-2 fill-white p-1 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={videosFirstElementIsIntersecting}
              handleClick={() => {
                videosRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowLeft />
            </Button>
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={videosLastElementIsIntersecting}
              handleClick={() => {
                videosRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowRight />
            </Button>
          </div>

          <Header>Clips</Header>
          {clips.data.length > 0 && (
            <div
              ref={clipsRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {clips.data.map((clip, index) => (
                <ClipCard
                  key={index}
                  clip={clip}
                  elementRef={index === 0 ? clipsFirstRef : null}
                />
              ))}
              <Link
                to="/clips"
                ref={clipsLastRef}
                className="bg-sky-500 border-sky-500 hover:bg-sky-700 flex snap-start self-center rounded-lg border-2 fill-white p-1 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={clipsFirstElementIsIntersecting}
              handleClick={() => {
                clipsRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowLeft />
            </Button>
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={clipsLastElementIsIntersecting}
              handleClick={() => {
                clipsRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowRight />
            </Button>
          </div>

          <Header>Discussions</Header>
          {discussions.data.length > 0 && (
            <div
              ref={discussionsRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {discussions.data.map((discussion, index) => (
                <DiscussionCard
                  key={index}
                  discussion={discussion}
                  elementRef={index === 0 ? discussionsFirstRef : null}
                />
              ))}
              <Link
                to="/discussions"
                ref={discussionsLastRef}
                className="bg-sky-500 border-sky-500 hover:bg-sky-700 flex snap-start self-center rounded-lg border-2 fill-white p-1 focus:border-2 focus:border-black focus:ring-0 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={discussionsFirstElementIsIntersecting}
              handleClick={() => {
                discussionsRef.current.scrollBy({
                  left: -320,
                  behavior: 'smooth',
                });
              }}
            >
              <SVGOutlineArrowLeft />
            </Button>
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              isDisabled={discussionsLastElementIsIntersecting}
              handleClick={() => {
                discussionsRef.current.scrollBy({
                  left: 320,
                  behavior: 'smooth',
                });
              }}
            >
              <SVGOutlineArrowRight />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Explore;
