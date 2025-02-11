import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { storeMessage, clearHistory, getMessages } from '../utils/storageUtils';
import { TextState, TextAction, textReducer } from './TextReducer';

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

function logStateChange(action: TextAction, prevState: TextState, nextState: TextState) {
    console.debug(
        `[TextContext] ${action.type}:`,
        '\n  Action:', action,
        '\n  Previous:', prevState,
        '\n  Next:', nextState,
        '\n  Timestamp:', new Date().toISOString()
    );
}

export function TextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(textReducer, {
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
                    const action = { type: 'TEXT_SAVED' as const, payload: Date.now() };
                    dispatch(action);
                    logStateChange(action, state, textReducer(state, action));
                } catch (error) {
                    dispatch({ type: 'SET_ERROR', payload: 'Failed to autosave' });
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
        const action = { type: 'SET_TEXT' as const, payload: newText };
        dispatch(action);
        logStateChange(action, state, textReducer(state, action));
    }, [state]);

    const clearText = useCallback(async () => {
        try {
            await clearHistory();
            const action = { type: 'CLEAR_TEXT' as const };
            dispatch(action);
            logStateChange(action, state, textReducer(state, action));
        } catch (error) {
            dispatch({ 
                type: 'SET_ERROR',
                payload: 'Failed to clear history'
            });
        }
    }, [state]);

    const restoreLastSession = useCallback(async () => {
        try {
            const { messages } = await getMessages(0, 1);
            if (messages.length > 0) {
                const action = { 
                    type: 'RESTORE_SESSION' as const,
                    payload: messages[0]
                };
                dispatch(action);
                logStateChange(action, state, textReducer(state, action));
            }
        } catch (error) {
            dispatch({ 
                type: 'SET_ERROR',
                payload: 'Failed to restore session'
            });
        }
    }, [state]);

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
