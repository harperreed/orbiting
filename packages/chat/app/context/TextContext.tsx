import React, { createContext, useContext, useState, useCallback } from 'react';
import { storeMessage, clearHistory } from '../utils/storageUtils';

interface TextContextType {
    text: string;
    setText: (text: string) => void;
    handleTextChange: (newText: string) => Promise<void>;
    clearText: () => Promise<void>;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

export function TextProvider({ children }: { children: React.ReactNode }) {
    const [text, setText] = useState("");

    const handleTextChange = useCallback(async (newText: string) => {
        setText(newText);
        try {
            await storeMessage(newText);
        } catch (error) {
            console.error("Failed to store message:", error);
        }
    }, []);

    const clearText = useCallback(async () => {
        setText("");
        try {
            await clearHistory();
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    }, []);

    return (
        <TextContext.Provider value={{ text, setText, handleTextChange, clearText }}>
            {children}
        </TextContext.Provider>
    );
}

export function useText() {
    const context = useContext(TextContext);
    if (context === undefined) {
        throw new Error('useText must be used within a TextProvider');
    }
    return context;
}
