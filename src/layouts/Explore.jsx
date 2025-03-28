import { useEffect, useState, useRef } from 'react';
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
import IconButton from '../components/IconButton';
import SVGOutlineArrowLeft from '../components/svgs/outline/SVGOutlineArrowLeft';
import SVGOutlineArrowRight from '../components/svgs/outline/SVGOutlineArrowRight';
import SVGOutlineRegularArrowRight from '../components/svgs/outline/SVGOutlineRegularArrowRight';
import Loading from '../components/Loading';

function Explore() {
  const [usersFirstRef, usersFirstElementIsIntersecting] =
    useElementIntersection(1);
  const [usersLastRef, usersLastElementIsIntersecting] =
    useElementIntersection(1);
  const [videosFirstRef, videosFirstElementIsIntersecting] =
    useElementIntersection(1);
  const [videosLastRef, videosLastElementIsIntersecting] =
    useElementIntersection(1);
  const [clipsFirstRef, clipsFirstElementIsIntersecting] =
    useElementIntersection(1);
  const [clipsLastRef, clipsLastElementIsIntersecting] =
    useElementIntersection(1);
  const [discussionsFirstRef, discussionsFirstElementIsIntersecting] =
    useElementIntersection(1);
  const [discussionsLastRef, discussionsLastElementIsIntersecting] =
    useElementIntersection(1);

  const usersRef = useRef();
  const videosRef = useRef();
  const clipsRef = useRef();
  const discussionsRef = useRef();

  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([]);
  const [clips, setClips] = useState([]);
  const [discussions, setDiscussions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
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

      setVideos(videosResponse.data);
      setClips(clipsResponse.data);
      setUsers(usersResponse.data);
      setDiscussions(discussionsResponse.data);

      setIsLoading(false);
    }

    initialize();
  }, []);

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          <h1>Users</h1>
          {users.length > 0 && (
            <div
              ref={usersRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-y-hidden overflow-x-scroll overscroll-x-contain"
            >
              {users.map((user, index) => (
                <Link
                  key={user.id}
                  to={`/users/${user.username}`}
                  className="w-[128px] snap-start"
                  ref={index === 0 ? usersFirstRef : null}
                >
                  <UserCard user={user} />
                </Link>
              ))}
              <Link
                to="/users"
                ref={usersLastRef}
                className="flex snap-start self-center rounded-full border-2 border-transparent fill-black p-1 hover:bg-neutral-200 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
              >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <IconButton
              isDisabled={usersFirstElementIsIntersecting}
              handleClick={() => {
                usersRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowLeft />
            </IconButton>
            <IconButton
              isDisabled={usersLastElementIsIntersecting}
              handleClick={() => {
                usersRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowRight />
            </IconButton>
          </div>

          <h1>Videos</h1>
          {videos.length > 0 && (
            <div
              ref={videosRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-y-hidden overflow-x-scroll overscroll-x-contain"
            >
              {videos.map((video, index) => (
                <Link
                  key={video.id}
                  to={`/videos/${video.id}`}
                  className="w-[320px] snap-start"
                  ref={index === 0 ? videosFirstRef : null}
                >
                  <VideoCard video={video} />
                </Link>
              ))}
              <Link
                to="/videos"
                ref={videosLastRef}
                className="flex snap-start self-center rounded-full border-2 border-transparent fill-black p-1 hover:bg-neutral-200 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
              >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <IconButton
              isDisabled={videosFirstElementIsIntersecting}
              handleClick={() => {
                videosRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowLeft />
            </IconButton>
            <IconButton
              isDisabled={videosLastElementIsIntersecting}
              handleClick={() => {
                videosRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowRight />
            </IconButton>
          </div>

          <h1>Clips</h1>
          {clips.length > 0 && (
            <div
              ref={clipsRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-y-hidden overflow-x-scroll overscroll-x-contain"
            >
              {clips.map((clip, index) => (
                <Link
                  key={clip.id}
                  to={`/clips/${clip.id}`}
                  className="w-[320px] snap-start"
                  ref={index === 0 ? clipsFirstRef : null}
                >
                  <ClipCard clip={clip} />
                </Link>
              ))}
              <Link
                to="/clips"
                ref={clipsLastRef}
                className="flex snap-start self-center rounded-full border-2 border-transparent fill-black p-1 hover:bg-neutral-200 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
              >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <IconButton
              isDisabled={clipsFirstElementIsIntersecting}
              handleClick={() => {
                clipsRef.current.scrollBy({ left: -320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowLeft />
            </IconButton>
            <IconButton
              isDisabled={clipsLastElementIsIntersecting}
              handleClick={() => {
                clipsRef.current.scrollBy({ left: 320, behavior: 'smooth' });
              }}
            >
              <SVGOutlineArrowRight />
            </IconButton>
          </div>

          <h1>Discussions</h1>
          {discussions.length > 0 && (
            <div
              ref={discussionsRef}
              className="app_hide-scrollbar grid w-full snap-x snap-mandatory grid-flow-col justify-start gap-2 overflow-y-hidden overflow-x-scroll overscroll-x-contain"
            >
              {discussions.map((discussion, index) => (
                <Link
                  key={discussion.id}
                  to={`/discussions/${discussion.id}`}
                  className="w-[320px] snap-start rounded-lg border-2 border-neutral-200"
                  ref={index === 0 ? discussionsFirstRef : null}
                >
                  <DiscussionCard discussion={discussion} />
                </Link>
              ))}
              <Link
                to="/discussions"
                ref={discussionsLastRef}
                className="flex snap-start self-center rounded-full border-2 border-transparent fill-black p-1 hover:bg-neutral-200 focus:border-2 focus:border-black focus:outline-hidden focus:ring-0 disabled:pointer-events-none disabled:opacity-50"
              >
                <SVGOutlineRegularArrowRight />
              </Link>
            </div>
          )}
          <div className="flex gap-2 self-end">
            <IconButton
              isDisabled={discussionsFirstElementIsIntersecting}
              handleClick={() => {
                discussionsRef.current.scrollBy({
                  left: -320,
                  behavior: 'smooth',
                });
              }}
            >
              <SVGOutlineArrowLeft />
            </IconButton>
            <IconButton
              isDisabled={discussionsLastElementIsIntersecting}
              handleClick={() => {
                discussionsRef.current.scrollBy({
                  left: 320,
                  behavior: 'smooth',
                });
              }}
            >
              <SVGOutlineArrowRight />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}

export default Explore;
