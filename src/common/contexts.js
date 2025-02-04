import { createContext } from 'react';

const SessionContext = createContext(null);
const UserContext = createContext(null);
const ScreenResizeContext = createContext(null);
const ModalContext = createContext(null);
const FullscreenContext = createContext(null);
const ExploreContext = createContext(null);
const NotificationsContext = createContext(null);

export {
  ModalContext,
  ScreenResizeContext,
  SessionContext,
  UserContext,
  FullscreenContext,
  ExploreContext,
  NotificationsContext,
};
