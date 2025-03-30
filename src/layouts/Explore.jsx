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
import Subheader from '../components/Subheader';
import { BUTTON_COLOR } from '../common/enums';
import { DataContext } from '../common/context/DataContextProvider';
import Anchor from '../components/Anchor';

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
    users,
    setUsers,
    videos,
    setVideos,
    clips,
    setClips,
    discussions,
    setDiscussions,
  } = useContext(DataContext);

  const usersRef = useRef();
  const videosRef = useRef();
  const clipsRef = useRef();
  const discussionsRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!users.hasInitialized) {
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
        setDiscussions({
          data: discussionsResponse.data,
          hasInitialized: true,
        });

        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4">
      <Header>Explore</Header>
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <Subheader>Users</Subheader>
          {users.data.length > 0 && (
            <div
              ref={usersRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {users.data.map((user, index) => (
                <div key={index} className="w-[128px] snap-start">
                  <UserCard
                    user={user}
                    elementRef={index === 0 ? usersFirstRef : null}
                  />
                </div>
              ))}
              <Anchor to="/users" elementRef={usersLastRef}>
                <SVGOutlineRegularArrowRight />
              </Anchor>
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

          <Subheader>Videos</Subheader>
          {videos.data.length > 0 && (
            <div
              ref={videosRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {videos.data.map((video, index) => (
                <div key={index} className="w-[320px] snap-start">
                  <VideoCard
                    video={video}
                    elementRef={index === 0 ? videosFirstRef : null}
                  />
                </div>
              ))}
              <Anchor to="/videos" elementRef={videosLastRef}>
                <SVGOutlineRegularArrowRight />
              </Anchor>
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

          <Subheader>Clips</Subheader>
          {clips.data.length > 0 && (
            <div
              ref={clipsRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {clips.data.map((clip, index) => (
                <div key={index} className="w-[320px] snap-start">
                  <ClipCard
                    clip={clip}
                    elementRef={index === 0 ? clipsFirstRef : null}
                  />
                </div>
              ))}
              <Anchor to="/clips" elementRef={clipsLastRef}>
                <SVGOutlineRegularArrowRight />
              </Anchor>
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

          <Subheader>Discussions</Subheader>
          {discussions.data.length > 0 && (
            <div
              ref={discussionsRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-x-scroll overflow-y-hidden overscroll-x-contain"
            >
              {discussions.data.map((discussion, index) => (
                <div key={index} className="w-[320px] snap-start">
                  <DiscussionCard
                    discussion={discussion}
                    elementRef={index === 0 ? discussionsFirstRef : null}
                  />
                </div>
              ))}
              <Anchor to="/discussions" elementRef={discussionsLastRef}>
                <SVGOutlineRegularArrowRight />
              </Anchor>
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
