import React, { createContext, useState } from 'react';

export const GlobalContext = createContext();
const defaultContextState = {
  code: '',
  theme: 'light',
};
export default ({ children }) => {
  const [contextState, setContextState] = useState(defaultContextState);
  const setCode = (code) => {
    if (code !== contextState.code) {
      setContextState({ ...contextState, code });
    }
  };
  const toggleTheme = () => setContextState({ ...contextState, theme: contextState.theme === 'light' ? 'dark' : 'light' });

  return (
    <GlobalContext.Provider value={{ ...contextState, setCode, toggleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};
