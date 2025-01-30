import { useContext } from "react";
import { ModalContext } from "../common/contexts";
import IconButton from "./IconButton";
import SVGOutlineX from "./svgs/outline/SVGOutlineX";

function Modal({ children, handleClose, handleSubmit }) {
  const { setShowModal } = useContext(ModalContext);

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col gap-8 overflow-y-scroll bg-black p-4 text-white">
      <div className="flex justify-end">
        <IconButton handleClick={() => setShowModal(null)}>
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
