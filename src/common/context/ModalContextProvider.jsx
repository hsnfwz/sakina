import { createContext, useState } from 'react';

const ModalContext = createContext();

function ModalContextProvider({ children }) {
  const [showModal, setShowModal] = useState({ type: null, data: null });

  return (
    <ModalContext.Provider
      value={{
        showModal,
        setShowModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export { ModalContext, ModalContextProvider };
