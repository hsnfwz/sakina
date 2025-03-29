import { useContext, useEffect } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import Button from './Button';
import SVGOutlineX from './svgs/outline/SVGOutlineX';
import { useLocation, useNavigate } from 'react-router';

function Modal({ children, isDisabled }) {
  const { setShowModal } = useContext(ModalContext);

  const location = useLocation();
  const navigate = useNavigate();

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
      navigate(location.pathname);
    }
  }

  return (
    <div
      className="fixed top-0 left-0 z-50 h-screen w-full overflow-y-auto bg-black/75 p-4 backdrop-blur-lg"
      onClick={handleModalClickOutside}
    >
      <div className="m-auto flex w-full max-w-(--breakpoint-md) flex-col gap-4 rounded-lg bg-white p-4">
        <div className="flex justify-end">
          <Button isDisabled={isDisabled} handleClick={closeModal}>
            <SVGOutlineX />
          </Button>
        </div>
        <div className="mx-auto flex h-full w-full max-w-(--breakpoint-md) flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
