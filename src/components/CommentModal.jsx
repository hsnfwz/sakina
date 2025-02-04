import { useContext, useState } from 'react';
import { ModalContext, UserContext } from '../common/contexts';
import { supabase } from '../common/supabase';
import Button from './Button';
import Modal from './Modal';
import Textarea from './Textarea';
import Toggle from './Toggle';

const descriptionCharacterLimit = 2000;

function CommentModal() {
  const { user } = useContext(UserContext);
  const { showModal, setShowModal } = useContext(ModalContext);

  const [isAddingQuestionComment, setIsAddingQuestionComment] = useState(false);

  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  async function addQuestionComment() {
    setIsAddingQuestionComment(true);
    const { data, error } = await supabase
      .from('question_comments')
      .insert({
        user_id: user.id,
        question_id: showModal.data.questionId,
        parent_question_comment_id: showModal.data.parentQuestionCommentId,
        description,
        is_anonymous: isAnonymous,
      })
      .select('*');

    if (error) {
      console.log(error);
    } else {
      await supabase.rpc('increment', {
        table_name: 'question_comments',
        row_id: showModal.data.parentQuestionCommentId
          ? showModal.data.parentQuestionCommentId
          : showModal.data.questionId,
        row_column: 'comments_count',
        increment_amount: 1,
      });
    }
    setIsAddingQuestionComment(false);
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
        <p>Question: {showModal.data.questionId}</p>
        {showModal.data.parentQuestionCommentId && (
          <p>Comment: {showModal.data.parentQuestionCommentId}</p>
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
            isAddingQuestionComment ||
            description === '' ||
            description.length > descriptionCharacterLimit
          }
          isLoading={isAddingQuestionComment}
          handleClick={async () => await addQuestionComment()}
          isOutline={true}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default CommentModal;
