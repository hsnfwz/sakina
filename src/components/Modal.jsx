import { useContext, useEffect } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import IconButton from './IconButton';
import SVGOutlineX from './svgs/outline/SVGOutlineX';

function Modal({ children, isDisabled }) {
  const { setShowModal } = useContext(ModalContext);

  useEffect(() => {
    disableBodyScroll();

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });

    return () => {
      enableBodyScroll();
    };
  }, []);

  function enableBodyScroll() {
    const body = document.querySelector('body');
    body.classList.add('overflow-auto');
    body.classList.remove('overflow-hidden');
  }

  function disableBodyScroll() {
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden');
    body.classList.remove('overflow-auto');
  }

  function handleModalClickOutside(event) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  function clearShowModal() {
    setShowModal({ type: null, data: null });
  }

  function closeModal() {
    if (!isDisabled) {
      enableBodyScroll();
      clearShowModal();
    }
  }

  return (
    <div
      className="fixed left-0 top-0 z-50 h-screen w-full overflow-y-auto bg-black/75 p-4 backdrop-blur-lg"
      onClick={handleModalClickOutside}
    >
      <div className="m-auto flex w-full max-w-screen-md flex-col gap-4 rounded-lg bg-white p-4">
        <div className="flex justify-end">
          <IconButton isDisabled={isDisabled} handleClick={closeModal}>
            <SVGOutlineX />
          </IconButton>
        </div>
        <div className="mx-auto flex h-full w-full max-w-screen-md flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
