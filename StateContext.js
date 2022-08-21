import React, { useState, createContext } from 'react';

export const StateContext = createContext();

export const StateProvider = ({ children }) => {

  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [darkMode, setDarkMode] = useState('auto');
  const [enableHistory, setEnableHistory] = useState(true);
  const [enableShake, setEnableShake] = useState(true);
  const [enableDoubleTap, setEnableDoubleTap] = useState(true);


  return (
    <StateContext.Provider value={{
      messageHistory,
      setMessageHistory,
      message,
      setMessage,
      theme,
      setTheme,
      darkMode,
      setDarkMode,
      enableHistory,
      setEnableHistory,
      enableShake,
      setEnableShake,
      enableDoubleTap,
      setEnableDoubleTap,
    }}>
      {children}
    </StateContext.Provider>
  );
}