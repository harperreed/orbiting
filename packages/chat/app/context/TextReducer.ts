import { StoredMessage } from '../utils/storageUtils';

export interface TextState {
    text: string;
    lastSaved: number | null;
    isDirty: boolean;
    error: string | null;
    isLoading: boolean;
}

// Action type constants
export const TEXT_ACTIONS = {
    SET_TEXT: 'SET_TEXT',
    TEXT_SAVED: 'TEXT_SAVED',
    CLEAR_TEXT: 'CLEAR_TEXT',
    RESTORE_SESSION: 'RESTORE_SESSION',
    SET_ERROR: 'SET_ERROR',
    SET_LOADING: 'SET_LOADING',
} as const;

export type TextAction = 
    | { type: typeof TEXT_ACTIONS.SET_TEXT; payload: string }
    | { type: typeof TEXT_ACTIONS.TEXT_SAVED; payload: number }
    | { type: typeof TEXT_ACTIONS.CLEAR_TEXT }
    | { type: typeof TEXT_ACTIONS.RESTORE_SESSION; payload: StoredMessage }
    | { type: typeof TEXT_ACTIONS.SET_ERROR; payload: string }
    | { type: typeof TEXT_ACTIONS.SET_LOADING; payload: boolean };

export function textReducer(state: TextState, action: TextAction): TextState {
    switch (action.type) {
        case TEXT_ACTIONS.SET_TEXT:
            return {
                ...state,
                text: action.payload,
                isDirty: true,
                error: null
            };
        
        case TEXT_ACTIONS.TEXT_SAVED:
            return {
                ...state,
                lastSaved: action.payload,
                isDirty: false,
                error: null,
                isLoading: false
            };
            
        case TEXT_ACTIONS.CLEAR_TEXT:
            return {
                ...state,
                text: '',
                lastSaved: Date.now(),
                isDirty: false,
                error: null,
                isLoading: false
            };
            
        case TEXT_ACTIONS.RESTORE_SESSION:
            return {
                ...state,
                text: action.payload.text,
                lastSaved: action.payload.timestamp,
                isDirty: false,
                error: null,
                isLoading: false
            };
            
        case TEXT_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
            
        case TEXT_ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
                error: null
            };
            
        default: {
            const _exhaustiveCheck: never = action;
            void _exhaustiveCheck; // Explicitly mark as used
            return state;
        }
    }
}
