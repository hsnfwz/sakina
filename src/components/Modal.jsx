import { useContext, useEffect, useRef } from 'react';
import { ModalContext } from '../common/context/ModalContextProvider';
import Button from './Button';
import SVGOutlineX from './svgs/outline/SVGOutlineX';
import { BUTTON_COLOR } from '../common/enums';

function Modal({ children, isDisabled, show, handleClose }) {
  const { setModal } = useContext(ModalContext);

  const modalRef = useRef();

  useEffect(() => {
    if (show) {
      disableBodyScroll();

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKeyPress = (event) => {
        if (event.key === "Tab") {
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      const handleEscapeKeyPress = (event) => {
        if (event.key === "Escape") {
          closeModal(false);
        }
      };

      modalRef.current.addEventListener("keydown", handleTabKeyPress);
      document.addEventListener("keydown", handleEscapeKeyPress);

      return () => {
        modalRef.current.removeEventListener("keydown", handleTabKeyPress);
        document.removeEventListener("keydown", handleEscapeKeyPress);
        enableBodyScroll();
      };
    }
  }, [show]);

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

  function closeModal() {
    if (!isDisabled) {
      handleClose();
      setModal({ type: null, data: null });
      enableBodyScroll();
    }
  }

  return (
    <div
      ref={modalRef}
      className={`fixed top-0 left-0 z-50 h-screen w-full overflow-y-auto bg-black/75 p-4 backdrop-blur-lg ${show ? 'block' : 'hidden'}`}
      onClick={handleModalClickOutside}
    >
      <div className="m-auto flex w-full max-w-(--breakpoint-md) flex-col gap-4 rounded-lg bg-white p-4">
        <div className="flex justify-end">
          <Button
            isRound={true}
            color={BUTTON_COLOR.SOLID_WHITE}
            isDisabled={isDisabled}
            handleClick={closeModal}
          >
            <SVGOutlineX />
          </Button>
        </div>
        <div className="mx-auto flex h-full w-full max-w-(--breakpoint-md) flex-col gap-4">
          {children}
        </div>
      </div>
      <div tabIndex={0}></div>
    </div>
  );
}

export default Modal;
