import React, { createContext, useState } from 'react';

export const GlobalStateContext = createContext();
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
    <GlobalStateContext.Provider value={{ ...contextState, setCode, toggleTheme }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
