import { useContext, useEffect, useState } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import Modal from '../components/Modal';
import Button from '../components/Button';

function HideModal() {
  const { modal, setModal } = useContext(ModalContext);
  const [title, setTitle] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modal.type === 'HIDE_MODAL') {
      setTitle(modal.data.title);
      setShow(true);
    } else {
      setShow(false);
    }
  }, [modal]);

  async function handleSubmit() {
    setIsLoading(true);
    await modal.data.handleHide();
    setIsLoading(false);
    setModal({ type: null, data: null });
  }

  return (
    <Modal show={show} isDisabled={isLoading}>
      <p>Do you want to archive <span className="font-bold">"{title}"</span>?</p>
      <div className="flex gap-2 self-end">
        <Button
          isDisabled={isLoading}
          handleClick={() => setModal({ type: null, data: null })}
        >
          No
        </Button>
        <Button isDisabled={isLoading} handleClick={handleSubmit}>
          Yes
        </Button>
      </div>
    </Modal>
  );
}

export default HideModal;
