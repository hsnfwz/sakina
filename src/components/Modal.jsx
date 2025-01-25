import { useContext } from "react";
import { ModalContext } from "../common/contexts";
import IconButton from "./IconButton";
import SVGX from "./svg/SVGX";

function Modal({ children }) {
  const { setShowModal } = useContext(ModalContext);

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-col gap-4 overflow-y-auto bg-black p-4 text-white">
      <div className="relative">{children}</div>
      <div className="fixed bottom-0 left-0 flex w-full justify-center border-t border-t-neutral-700 p-4">
        <IconButton handleClick={() => setShowModal(null)}>
          <SVGX />
        </IconButton>
      </div>
    </div>
  );
}

export default Modal;
