import { useContext, useState, useEffect } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { AuthContext } from '../common/context/AuthContextProvider';
import { CHARACTER_LIMIT, BUTTON_COLOR } from '../common/enums';
import { addDiscussion } from '../common/database/discussions';
import { increment } from '../common/database/rpc';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Textarea from '../components/Textarea';
import TextInput from '../components/TextInput';

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
      'discussions_count',
      1
    );

    setIsLoading(false);
    handleClose();
    setModal({
      type: null,
      data: null,
    });
  }

  function handleClose() {
    setTitle('');
    setDescription('');
    setIsAnonymous(false);
  }

  return (
    <Modal show={show} isDisabled={isLoading} handleClose={handleClose}>
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
      <div className="flex flex-col gap-2">
        <label>Anonymous</label>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${isAnonymous ? 'bg-white text-black' : 'bg-sky-500 text-white'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 hover:bg-sky-700 focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
            onMouseDown={(event) => event.preventDefault()}
            color={
              isAnonymous ? BUTTON_COLOR.OUTLINE_BLUE : BUTTON_COLOR.SOLID_BLUE
            }
            onClick={() => setIsAnonymous(false)}
          >
            No
          </button>
          <button
            type="button"
            className={`${isAnonymous ? 'bg-sky-500 text-white' : 'bg-white text-black'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 hover:bg-sky-700 focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
            onMouseDown={(event) => event.preventDefault()}
            color={
              isAnonymous ? BUTTON_COLOR.SOLID_BLUE : BUTTON_COLOR.OUTLINE_BLUE
            }
            onClick={() => setIsAnonymous(true)}
          >
            Yes
          </button>
        </div>
      </div>
      <div className="flex gap-2 self-end">
        <Button
          color={BUTTON_COLOR.OUTLINE_BLACK}
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
          color={BUTTON_COLOR.SOLID_BLUE}
          isDisabled={
            isLoading ||
            title.length === 0 ||
            title.length > CHARACTER_LIMIT.TITLE.max ||
            description.length > CHARACTER_LIMIT.DESCRIPTION.max
          }
          handleClick={async () => await addComment()}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default CommentModal;
