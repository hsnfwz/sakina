import { useContext } from 'react';
import Modal from '../components/Modal';
import { ModalContext } from '../common/contexts';
import Button from '../components/Button';
import { BUTTON_COLOR } from '../common/enums';

function ConfirmModal() {
  const { showModal, setShowModal } = useContext(ModalContext);

  return (
    <Modal>
      <h1 className="text-2xl font-bold">{showModal.data.title}</h1>
      <p>{showModal.data.description}</p>
      <div className="flex gap-2 self-end">
        <Button
          handleClick={() => {
            setShowModal({
              type: null,
              data: null,
            });
          }}
        >
          No
        </Button>
        <Button
          buttonColor={BUTTON_COLOR.RED}
          handleClick={async () => {
            await showModal.data.handleSubmit();
            setShowModal({
              type: null,
              data: null,
            });
          }}
        >
          Yes
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
