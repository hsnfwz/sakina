import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { CHARACTER_LIMIT } from '../common/enums';
import Modal from '../components/Modal';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Toggle from '../components/Toggle';

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
    setModal({ type: null, data: null });
  }

  return (
    <Modal show={show} isDisabled={isLoading}>
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
      <Toggle
        handleChange={() => setIsAnonymous(!isAnonymous)}
        isChecked={isAnonymous}
      >
        Anonymous
      </Toggle>
      <div className="flex gap-2 self-end">
        <Button
          isDisabled={isLoading}
          handleClick={() => setModal({ type: null, data: null })}
        >
          Close
        </Button>
        <Button isDisabled={isLoading} handleClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Modal>
  );
}

export default EditModal;
