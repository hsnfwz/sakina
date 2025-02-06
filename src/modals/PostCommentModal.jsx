import { useContext, useState } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import { supabase } from '../common/supabase';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import Toggle from '../components/Toggle';

const descriptionCharacterLimit = 2000;

function PostCommentModal() {
  const { user } = useContext(UserContext);
  const { showModal, setShowModal } = useContext(ModalContext);

  const [isAddingPostComment, setIsAddingPostComment] = useState(false);

  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function addPostComment() {
    setIsAddingPostComment(true);
    const { data, error } = await supabase
      .from('post_comments')
      .insert({
        user_id: user.id,
        post_id: showModal.data.postId,
        parent_post_comment_id: showModal.data.parentPostCommentId,
        description,
        is_anonymous: isAnonymous,
      })
      .select('*');

    if (error) {
      console.log(error);
    } else {
      await supabase.rpc('increment', {
        table_name: 'post_comments',
        row_id: showModal.data.parentPostCommentId
          ? showModal.data.parentPostCommentId
          : showModal.data.postId,
        row_column: 'comments_count',
        increment_amount: 1,
      });
    }
    setIsAddingPostComment(false);
    setDescription('');
    setIsAnonymous(true);
    setShowModal({
      type: null,
      data: null,
    });
  }

  return (
    <Modal>
      <h1 className="text-2xl font-bold">New Comment</h1>
      <div className="flex flex-col gap-2">
        <p>Post: {showModal.data.postId}</p>
        {showModal.data.parentPostCommentId && (
          <p>Comment: {showModal.data.parentPostCommentId}</p>
        )}
      </div>
      <Toggle
        handleChange={() => setIsAnonymous(!isAnonymous)}
        label="Anonymous"
        isChecked={isAnonymous}
      />
      <p
        className={`self-end ${description.length > descriptionCharacterLimit ? 'text-rose-500' : 'text-white'}`}
      >
        {description.length} / {descriptionCharacterLimit}
      </p>
      <Textarea
        handleInput={(event) => setDescription(event.target.value)}
        placeholder="Comment"
        value={description}
      />
      <div className="flex gap-2 self-end">
        <Button handleClick={() => setDescription('')}>Clear</Button>
        <Button
          isDisabled={
            isAddingPostComment ||
            description === '' ||
            description.length > descriptionCharacterLimit
          }
          isLoading={isAddingPostComment}
          handleClick={async () => await addPostComment()}
          isOutline={true}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default PostCommentModal;
