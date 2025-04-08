import { useContext } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import { useParams } from 'react-router';
import { useDiscussion, useDiscussionComments } from '../common/hooks/discussions';
import { useDiscussionLike } from '../common/hooks/discussion-likes';
import { useDiscussionView } from '../common/hooks/discussion-views';
import { useElementIntersection } from '../common/hooks';
import { AuthContext } from '../common/context/AuthContextProvider';
import { ModalContext } from '../common/context/ModalContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import {
  addDiscussionLike,
  removeDiscussionLike,
} from '../common/database/discussion-likes';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Loaded from '../components/Loaded';
import Comment from '../components/Comment';
import Header from '../components/Header';
import Subheader from '../components/Subheader';

function Discussion() {
  const { id } = useParams();
  const { authUser } = useContext(AuthContext);
  const { setModal } = useContext(ModalContext);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [discussion, fetchingDiscussion] = useDiscussion(id);
  const [discussionComments, fetchingDiscussionComments] = useDiscussionComments(discussion, intersectingElement);
  const [discussionLike, setDiscussionLike, fetchingDiscussionLike, setFetchingDiscussionLike] =
    useDiscussionLike(discussion);
  useDiscussionView(discussion);

  async function handleLike() {
    setFetchingDiscussionLike(true);

    const data = await addDiscussionLike({
      user_id: authUser.id,
      discussion_id: discussion.id,
    });

    setDiscussionLike(data);

    setFetchingDiscussionLike(false);
  }

  async function handleUnlike() {
    setFetchingDiscussionLike(true);

    await removeDiscussionLike(discussionLike.id);
    setDiscussionLike(null);

    setFetchingDiscussionLike(false);
  }

  async function handleLikeUnlike() {
    if (discussionLike) {
      await handleUnlike();
    } else {
      await handleLike();
    }
  }

  if (fetchingDiscussion) {
    return <Loading />;
  }

  if (!fetchingDiscussion && discussion) {
    return (
      <div className="flex w-full flex-col gap-4">
        <Header>{discussion.title}</Header>
        {discussion.description && <p>{discussion.description}</p>}
        <div className="flex gap-2">
          <Button
            isRound={true}
            color={BUTTON_COLOR.SOLID_GREEN}
            handleClick={() => {
              setModal({
                type: 'COMMENT_MODAL',
                data: {
                  parentDiscussionId: discussion.id,
                },
              });
            }}
          >
            <MessageCircle />
          </Button>
          {authUser && authUser.id !== discussion.user_id && (
            <Button
              isRound={true}
              color={
                discussionLike
                  ? BUTTON_COLOR.SOLID_RED
                  : BUTTON_COLOR.OUTLINE_RED
              }
              isDisabled={fetchingDiscussionLike}
              handleClick={handleLikeUnlike}
            >
              <Heart />
            </Button>
          )}
        </div>

        <Subheader>Comments</Subheader>
        {discussionComments.data.length > 0 && (
          <div className="flex w-full flex-col gap-4">
            {discussionComments.data.map((comment, index) => (
              <div className="rounded-lg bg-neutral-100 p-2" key={comment.id}>
                <Comment
                  key={index}
                  comment={comment}
                  elementRef={
                    index === discussionComments.data.length - 1 ? elementRef : null
                  }
                  showLink={true}
                />
              </div>
            ))}
          </div>
        )}
        {!discussionComments.hasMore && <Loaded />}
        {fetchingDiscussionComments && <Loading />}
      </div>
    );
  }
}

export default Discussion;
