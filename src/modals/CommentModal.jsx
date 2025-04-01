import { useContext, useState, useEffect } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { AuthContext } from '../common/context/AuthContextProvider';
import { CHARACTER_LIMIT } from '../common/enums';
import { addDiscussion } from '../common/database/discussions';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import Toggle from '../components/Toggle';
import TextInput from '../components/TextInput';
import { increment } from '../common/database/rpc';

function CommentModal() {
  const { authUser } = useContext(AuthContext);
  const { modal, setModal } = useContext(ModalContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (modal.type === 'COMMENT_MODAL' && modal.data) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  async function addComment() {
    setIsLoading(true);

    await addDiscussion({
      user_id: authUser.id,
      parent_discussion_id: modal.data.parentDiscussionId,
      title,
      description,
      is_anonymous: isAnonymous,
    });

    await increment(
      'discussions',
      modal.data.parentDiscussionId,
      'comments_count',
      1
    );

    setTitle('');
    setDescription('');
    setIsAnonymous(false);
    setIsLoading(false);

    setModal({
      type: null,
      data: null,
    });
  }

  return (
    <Modal show={show} isDisabled={isLoading}>
      <TextInput
        handleInput={(event) => setTitle(event.target.value)}
        placeholder="Title"
        value={title}
        label="Title"
        limit={CHARACTER_LIMIT.TITLE}
      />
      <Textarea
        handleInput={(event) => setDescription(event.target.value)}
        placeholder="Description"
        value={description}
        label="Description"
        limit={CHARACTER_LIMIT.DESCRIPTION}
      />
      <Toggle
        handleChange={() => setIsAnonymous(!isAnonymous)}
        isChecked={isAnonymous}
      >
        Anonymous
      </Toggle>
      <div className="flex gap-2 self-end">
        <Button
          handleClick={() => {
            setTitle('');
            setDescription('');
            setIsAnonymous(false);
            setModal({ type: null, data: null });
          }}
        >
          Close
        </Button>
        <Button
          isDisabled={
            isLoading ||
            title.length === 0 ||
            title.length > CHARACTER_LIMIT.TITLE.max ||
            description.length > CHARACTER_LIMIT.DESCRIPTION.max
          }
          isLoading={isLoading}
          handleClick={async () => await addComment()}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default CommentModal;
