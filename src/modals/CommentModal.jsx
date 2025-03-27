import { useContext, useState } from 'react';
import { ModalContext } from '../common/contexts';
import { AuthContext } from '../common/context/AuthContextProvider';
import { supabase } from '../common/supabase';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import Toggle from '../components/Toggle';

const descriptionCharacterLimit = 2000;

function CommentModal() {
  const { user } = useContext(AuthContext);
  const { showModal, setShowModal } = useContext(ModalContext);

  const [isAddingComment, setIsAddingComment] = useState(false);

  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function addComment() {
    setIsAddingComment(true);
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        post_id: showModal.data.postId,
        parent_comment_id: showModal.data.parentCommentId,
        description,
        is_anonymous: isAnonymous,
      })
      .select('*');

    if (error) {
      console.log(error);
    } else {
      await supabase.rpc('increment', {
        table_name: 'comments',
        row_id: showModal.data.parentCommentId
          ? showModal.data.parentCommentId
          : showModal.data.postId,
        row_column: 'comments_count',
        increment_amount: 1,
      });
    }
    setIsAddingComment(false);
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
        {showModal.data.parentCommentId && (
          <p>Comment: {showModal.data.parentCommentId}</p>
        )}
      </div>
      <Toggle
        handleChange={() => setIsAnonymous(!isAnonymous)}
        label="Anonymous"
        isChecked={isAnonymous}
      />
      <p
        className={`self-end ${description.length > descriptionCharacterLimit ? 'text-rose-500' : 'text-black'}`}
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
            isAddingComment ||
            description === '' ||
            description.length > descriptionCharacterLimit
          }
          isLoading={isAddingComment}
          handleClick={async () => await addComment()}
          isOutline={true}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default CommentModal;
