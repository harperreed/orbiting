import React, { useState, createContext } from "react";

/**
 * Context for managing global state in the application.
 */
export const StateContext = createContext();

/**
 * Provider component to wrap the application and provide state context.
 * @param {object} props - Props passed to the component.
 * @param {React.ReactNode} props.children - Children nodes to be rendered inside the provider.
 */
export const StateProvider = ({ children }) => {
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState("");
    const [theme, setTheme] = useState("light");
    const [darkMode, setDarkMode] = useState(false);
    const [enableHistory, setEnableHistory] = useState(true);
    const [enableShake, setEnableShake] = useState(true);
    const [enableDoubleTap, setEnableDoubleTap] = useState(true);

    // Debug console logging
    console.debug("StateProvider values:", {
        messageHistory,
        message,
        theme,
        darkMode,
        enableHistory,
        enableShake,
        enableDoubleTap,
    });

    return (
        <StateContext.Provider
            value={{
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
            }}
        >
            {children}
        </StateContext.Provider>
    );
};
