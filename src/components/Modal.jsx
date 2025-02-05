import { useContext, useEffect } from 'react';
import { ModalContext } from '../common/contexts';
import IconButton from './IconButton';
import SVGOutlineX from './svgs/outline/SVGOutlineX';

function Modal({ children }) {
  const { showModal, setShowModal } = useContext(ModalContext);

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

  function clearShowModal() {
    setShowModal({
      type: null,
      data: null,
    });
  }

  function closeModal() {
    enableBodyScroll();
    clearShowModal();
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col gap-8 overflow-y-scroll bg-black p-4 text-white">
      <div className="flex justify-end">
        <IconButton
          handleClick={() => {
            closeModal();
          }}
        >
          <SVGOutlineX />
        </IconButton>
      </div>
      <div className="mx-auto flex h-full w-full max-w-screen-md flex-col gap-8">
        {children}
      </div>
    </div>
  );
}

export default Modal;
