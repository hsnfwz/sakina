import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { CHARACTER_LIMIT, BUTTON_COLOR } from '../common/enums';
import Modal from '../components/Modal';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

function EditModal() {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modal.type === 'EDIT_MODAL' && modal.data) {
      setTitle(modal.data.title);
      setDescription(modal.data.description);
      setIsAnonymous(modal.data.is_anonymous);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  async function handleSubmit() {
    setIsLoading(true);
    const payload = {
      title,
      description,
      is_anonymous: isAnonymous,
    };
    await modal.data.handleEdit(payload);
    setIsLoading(false);
    handleClose();
    setModal({ type: null, data: null });
  }

  function handleClose() {
    setTitle('');
    setDescription('');
    setIsAnonymous(false);
  }

  return (
    <Modal show={show} isDisabled={isLoading} handleClose={handleClose}>
      <TextInput
        limit={CHARACTER_LIMIT.TITLE}
        value={title}
        placeholder="Title"
        label="Title"
        handleInput={(event) => setTitle(event.currentTarget.value)}
      />
      <Textarea
        limit={CHARACTER_LIMIT.DESCRIPTION}
        value={description}
        placeholder="Description"
        label="Description"
        handleInput={(event) => setDescription(event.currentTarget.value)}
      />
      <div className="flex flex-col gap-2">
        <label>Anonymous</label>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${isAnonymous ? 'bg-white text-black' : 'bg-sky-500 text-white'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 transition-all hover:bg-sky-700 hover:text-white focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
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
            className={`${isAnonymous ? 'bg-sky-500 text-white' : 'bg-white text-black'} text-whote cursor-pointer rounded-full border-2 border-sky-500 px-2 py-1 transition-all hover:bg-sky-700 hover:text-white focus:z-50 focus:border-black focus:ring-0 focus:outline-0`}
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
          isDisabled={isLoading}
          handleClick={() => {
            handleClose();
            setModal({ type: null, data: null });
          }}
        >
          Close
        </Button>
        <Button
          color={BUTTON_COLOR.SOLID_BLUE}
          isDisabled={
            isLoading ||
            (modal.data &&
              modal.data.title === title &&
              modal.data.description === description &&
              modal.data.is_anonymous === isAnonymous)
          }
          handleClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default EditModal;
