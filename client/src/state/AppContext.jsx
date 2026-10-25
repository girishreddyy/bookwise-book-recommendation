import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AppContext = createContext(null);
const readStorage = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};
export function AppProvider({ children }) {
  const [wantToRead, setWantToRead] = useState(() => readStorage('bookwise-want', []));
  const [readBooks, setReadBooks] = useState(() => readStorage('bookwise-read', []));
  const [interests, setInterests] = useState(() => readStorage('bookwise-interests', []));
  const [darkMode, setDarkMode] = useState(() => readStorage('bookwise-dark', false));
  useEffect(() => localStorage.setItem('bookwise-want', JSON.stringify(wantToRead)), [wantToRead]);
  useEffect(() => localStorage.setItem('bookwise-read', JSON.stringify(readBooks)), [readBooks]);
  useEffect(() => localStorage.setItem('bookwise-interests', JSON.stringify(interests)), [interests]);
  useEffect(() => localStorage.setItem('bookwise-dark', JSON.stringify(darkMode)), [darkMode]);
  const addWant = book => {
    setWantToRead(prev => prev.some(b => b.id === book.id) ? prev : [...prev, book]);
    setReadBooks(prev => prev.filter(b => b.id !== book.id));
  };
  const markRead = (book, rating = 0) => {
    setReadBooks(prev => [...prev.filter(b => b.id !== book.id), { ...book, rating }]);
    setWantToRead(prev => prev.filter(b => b.id !== book.id));
  };
  const removeBook = (id, tab) => tab === 'read'
    ? setReadBooks(prev => prev.filter(b => b.id !== id))
    : setWantToRead(prev => prev.filter(b => b.id !== id));
  const value = useMemo(() => ({
    wantToRead, readBooks, interests, setInterests, darkMode, setDarkMode,
    addWant, markRead, removeBook
  }), [wantToRead, readBooks, interests, darkMode]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
