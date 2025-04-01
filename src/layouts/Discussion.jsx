import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import {
  getDiscussionById,
  getCommentsByParentDiscussionId,
} from '../common/database/discussions';
import { DataContext } from '../common/context/DataContextProvider';
import { useElementIntersection } from '../common/hooks';
import { AuthContext } from '../common/context/AuthContextProvider';
import { ModalContext } from '../common/context/ModalContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Loaded from '../components/Loaded';
import Comment from '../components/Comment';
import SVGOutlineChat from '../components/svgs/outline/SVGOutlineChat';
import SVGOutlineHeart from '../components/svgs/outline/SVGOutlineHeart';
import Header from '../components/Header';
import Subheader from '../components/Subheader';

function Discussion() {
  const { id } = useParams();
  const location = useLocation();
  const { authUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const {
    comments,
    setComments,
    setNestedComments,
    activeDiscussion,
    setActiveDiscussion,
  } = useContext(DataContext);
  const [isLoadingDiscussion, setIsLoadingDiscussion] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (!location.state?.discussion) {
      getDiscussion();
    }

    if (location.state?.discussion) {
      if (!activeDiscussion) {
        setActiveDiscussion(location.state.discussion);
      }

      if (
        activeDiscussion &&
        activeDiscussion.id !== location.state.discussion.id
      ) {
        resetDiscussion();
        getDiscussion();
      }
    }
  }, [location]);

  useEffect(() => {
    if (activeDiscussion && !comments.hasInitialized) {
      getComments();
    }
  }, [activeDiscussion]);

  useEffect(() => {
    if (intersectingElement && comments.hasMore) {
      getComments();
    }
  }, [intersectingElement]);

  function resetDiscussion() {
    setComments({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setNestedComments({});
  }

  async function getDiscussion() {
    setIsLoadingDiscussion(true);
    const { data } = await getDiscussionById(id);
    setActiveDiscussion(data[0]);
    setIsLoadingDiscussion(false);
  }

  async function getComments() {
    setIsLoadingComments(true);

    const { data, hasMore } = await getCommentsByParentDiscussionId(
      activeDiscussion.id,
      comments.data.length
    );

    const _comments = { ...comments };

    if (data.length > 0) {
      _comments.data = [...comments.data, ...data];
    }

    _comments.hasMore = hasMore;
    _comments.hasInitialized = true;

    setComments(_comments);

    setIsLoadingComments(false);
  }

  if (isLoadingDiscussion) {
    return <Loading />;
  }

  if (activeDiscussion) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Header>{activeDiscussion.title}</Header>
        {activeDiscussion.description && <p>{activeDiscussion.description}</p>}
        {authUser && (
          <div className="flex gap-2">
            <Button
              color={BUTTON_COLOR.SOLID_GREEN}
              handleClick={() => {
                setModal({
                  type: 'COMMENT_MODAL',
                  data: {
                    parentDiscussionId: activeDiscussion.id,
                  },
                });
              }}
            >
              <SVGOutlineChat />
              {/* <span className="px-2">{activeDiscussion.comments_count}</span> */}
            </Button>
            <Button color={BUTTON_COLOR.SOLID_RED} handleClick={() => {}}>
              <SVGOutlineHeart />
              {/* <span className="px-2">{activeDiscussion.likes_count}</span> */}
            </Button>
          </div>
        )}
        <Subheader>Comments</Subheader>
        {comments.data.length > 0 && (
          <div className="flex flex-col gap-4 w-full">
            {comments.data.map((comment, index) => (
              <div className="p-2 bg-neutral-200 rounded-lg">
              <Comment
                key={index}
                comment={comment}
                elementRef={
                  index === comments.data.length - 1 ? elementRef : null
                }
                showLink={true}
              />
              </div>
            ))}
          </div>
        )}
        {isLoadingComments && <Loading />}
        {!comments.hasMore && <Loaded />}
      </div>
    );
  }
}

export default Discussion;
