import { createContext } from "react";

const SessionContext = createContext(null);
const UserContext = createContext(null);
const ScreenResizeContext = createContext(null);
const ModalContext = createContext(null);
const ScrollDataContext = createContext(null);
const FullscreenContext = createContext(null);

export {
  ModalContext,
  ScreenResizeContext,
  ScrollDataContext,
  SessionContext,
  UserContext,
  FullscreenContext,
};
