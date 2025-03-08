import { createContext } from 'react';

const SessionContext = createContext(null);
const UserContext = createContext(null);
const ModalContext = createContext(null);
const DataContext = createContext(null);
const ScrollContext = createContext(null);

export {
  ModalContext,
  SessionContext,
  UserContext,
  DataContext,
  ScrollContext,
};
