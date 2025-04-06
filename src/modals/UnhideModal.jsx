import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import { BUTTON_COLOR } from '../common/enums';
import Modal from '../components/Modal';
import Button from '../components/Button';

function UnhideModal() {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modal.type === 'UNHIDE_MODAL') {
      setTitle(modal.data.title);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  async function handleSubmit() {
    setIsLoading(true);
    await modal.data.handleUnhide();
    setIsLoading(false);
    handleClose();
    setModal({ type: null, data: null });
  }

  function handleClose() {
    setTitle('');
  }

  return (
    <Modal show={show} isDisabled={isLoading} handleClose={handleClose}>
      <p>
        Do you want to unarchive <span className="font-bold">"{title}"</span>? Other
        users will be able to view it.
      </p>
      <div className="flex gap-2 self-end">
        <Button
          color={BUTTON_COLOR.OUTLINE_BLACK}
          isDisabled={isLoading}
          handleClick={() => {
            handleClose();
            setModal({ type: null, data: null });
          }}
        >
          No
        </Button>
        <Button
          color={BUTTON_COLOR.SOLID_BLUE}
          isDisabled={isLoading}
          handleClick={handleSubmit}
        >
          Yes
        </Button>
      </div>
    </Modal>
  );
}

export default UnhideModal;
