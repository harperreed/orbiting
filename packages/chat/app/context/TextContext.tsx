import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { storeMessage, clearHistory, getMessages } from '../utils/storageUtils';

interface TextState {
    text: string;
    lastSaved: number | null;
    isDirty: boolean;
}

interface TextContextType {
    text: string;
    setText: (text: string) => void;
    handleTextChange: (newText: string) => Promise<void>;
    clearText: () => Promise<void>;
    isDirty: boolean;
    lastSaved: number | null;
    restoreLastSession: () => Promise<void>;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

const AUTOSAVE_DELAY = 1000; // 1 second

function logStateChange(action: string, prevState: TextState, nextState: TextState) {
    console.debug(
        `[TextContext] ${action}:`,
        '\n  Previous:', prevState,
        '\n  Next:', nextState,
        '\n  Timestamp:', new Date().toISOString()
    );
}

export function TextProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<TextState>({
        text: "",
        lastSaved: null,
        isDirty: false
    });
    
    const saveTimeoutRef = useRef<NodeJS.Timeout>();

    // Autosave mechanism
    useEffect(() => {
        if (state.isDirty) {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            
            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    await storeMessage(state.text);
                    setState(prev => ({
                        ...prev,
                        lastSaved: Date.now(),
                        isDirty: false
                    }));
                    logStateChange('Autosave', state, {
                        ...state,
                        lastSaved: Date.now(),
                        isDirty: false
                    });
                } catch (error) {
                    console.error("Failed to autosave:", error);
                }
            }, AUTOSAVE_DELAY);
        }
        
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [state.text, state.isDirty]);

    const handleTextChange = useCallback(async (newText: string) => {
        setState(prev => {
            const nextState = {
                ...prev,
                text: newText,
                isDirty: true
            };
            logStateChange('Text Change', prev, nextState);
            return nextState;
        });
    }, []);

    const clearText = useCallback(async () => {
        try {
            await clearHistory();
            setState(prev => {
                const nextState = {
                    text: "",
                    lastSaved: Date.now(),
                    isDirty: false
                };
                logStateChange('Clear Text', prev, nextState);
                return nextState;
            });
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    }, []);

    const restoreLastSession = useCallback(async () => {
        try {
            const messages = await getMessages();
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                setState(prev => {
                    const nextState = {
                        text: lastMessage.text,
                        lastSaved: lastMessage.timestamp,
                        isDirty: false
                    };
                    logStateChange('Restore Session', prev, nextState);
                    return nextState;
                });
            }
        } catch (error) {
            console.error("Failed to restore session:", error);
        }
    }, []);

    return (
        <TextContext.Provider value={{
            text: state.text,
            setText: (text: string) => setState(prev => ({ ...prev, text })),
            handleTextChange,
            clearText,
            isDirty: state.isDirty,
            lastSaved: state.lastSaved,
            restoreLastSession
        }}>
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
