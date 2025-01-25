import { createContext } from "react";

const SessionContext = createContext(null);
const UserContext = createContext(null);
const ScreenSizeContext = createContext(null);
const ModalContext = createContext(null);

export { ModalContext, ScreenSizeContext, SessionContext, UserContext };
