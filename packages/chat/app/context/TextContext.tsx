import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { storeMessage, getMessages } from '../utils/storageUtils';
import { TextState, TextAction, textReducer, TEXT_ACTIONS } from './TextReducer';

interface TextContextType {
    text: string;
    setText: (text: string) => void;
    handleTextChange: (newText: string) => Promise<void>;
    clearText: () => Promise<void>;
    isDirty: boolean;
    lastSaved: number | null;
    restoreLastSession: () => Promise<void>;
    error: string | null;
    isLoading: boolean;
}

const TextContext = createContext<TextContextType | undefined>(undefined);

const AUTOSAVE_DELAY = 1000; // 1 second

function logStateChange(action: TextAction, prevState: TextState, nextState: TextState) {
    if (process.env.NODE_ENV !== 'production') {
        const stateChanges = Object.keys(nextState).reduce((changes: Record<string, any>, key) => {
            if (prevState[key as keyof TextState] !== nextState[key as keyof TextState]) {
                changes[key] = {
                    from: prevState[key as keyof TextState],
                    to: nextState[key as keyof TextState]
                };
            }
            return changes;
        }, {});

        console.debug(
            `[TextContext] ${action.type}:`,
            '\n  Action:', action,
            '\n  Changes:', stateChanges,
            '\n  Timestamp:', new Date().toISOString()
        );
    }
}

export function TextProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(textReducer, {
        text: "",
        lastSaved: null,
        isDirty: false,
        error: null,
        isLoading: false
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
                    const action = { type: TEXT_ACTIONS.TEXT_SAVED, payload: Date.now() };
                    dispatch(action);
                    logStateChange(action, state, textReducer(state, action));
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to autosave';
                    dispatch({ 
                        type: TEXT_ACTIONS.SET_ERROR, 
                        payload: `Autosave failed: ${errorMessage}`
                    });
                    console.error('Autosave error:', error);
                }
            }, AUTOSAVE_DELAY);
        }
        
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [state]);

    const handleTextChange = useCallback(async (newText: string) => {
        try {
            dispatch({ type: TEXT_ACTIONS.SET_LOADING, payload: true });
            dispatch({ 
                type: TEXT_ACTIONS.SET_TEXT, 
                payload: newText
            });
        } catch (_error) {
            const errorMessage = _error instanceof Error ? _error.message : 'Failed to update text';
            dispatch({ 
                type: TEXT_ACTIONS.SET_ERROR,
                payload: errorMessage
            });
            console.error('Text update error:', _error);
        } finally {
            dispatch({ type: TEXT_ACTIONS.SET_LOADING, payload: false });
        }
    }, []);

    const clearText = useCallback(async () => {
        try {
            dispatch({ type: TEXT_ACTIONS.CLEAR_TEXT });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            dispatch({ 
                type: TEXT_ACTIONS.SET_ERROR,
                payload: `Failed to clear text: ${errorMessage}`
            });
            console.error('Clear text error:', error);
        }
    }, []);

    const restoreLastSession = useCallback(async () => {
        try {
            const { messages } = await getMessages(0, 1);
            if (messages.length > 0) {
                dispatch({ 
                    type: TEXT_ACTIONS.RESTORE_SESSION,
                    payload: messages[0]
                });
            }
        } catch (error) {
            dispatch({ 
                type: TEXT_ACTIONS.SET_ERROR,
                payload: 'Failed to restore session'
            });
        }
    }, []);

    return (
        <TextContext.Provider value={{
            text: state.text,
            setText: useCallback((text: string) => {
                dispatch({ type: TEXT_ACTIONS.SET_TEXT, payload: text });
            }, []),
            handleTextChange,
            clearText,
            isDirty: state.isDirty,
            lastSaved: state.lastSaved,
            restoreLastSession,
            error: state.error,
            isLoading: state.isLoading
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
