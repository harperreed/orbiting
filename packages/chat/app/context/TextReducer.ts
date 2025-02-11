import { StoredMessage } from '../utils/storageUtils';

export interface TextState {
    text: string;
    lastSaved: number | null;
    isDirty: boolean;
}

// Action type constants
export const TEXT_ACTIONS = {
    SET_TEXT: 'SET_TEXT',
    TEXT_SAVED: 'TEXT_SAVED',
    CLEAR_TEXT: 'CLEAR_TEXT',
    RESTORE_SESSION: 'RESTORE_SESSION',
    SET_ERROR: 'SET_ERROR',
} as const;

export type TextAction = 
    | { type: typeof TEXT_ACTIONS.SET_TEXT; payload: string }
    | { type: typeof TEXT_ACTIONS.TEXT_SAVED; payload: number }
    | { type: typeof TEXT_ACTIONS.CLEAR_TEXT }
    | { type: typeof TEXT_ACTIONS.RESTORE_SESSION; payload: StoredMessage }
    | { type: typeof TEXT_ACTIONS.SET_ERROR; payload: string };

export function textReducer(state: TextState, action: TextAction): TextState {
    switch (action.type) {
        case 'SET_TEXT':
            return {
                ...state,
                text: action.payload,
                isDirty: true
            };
        
        case 'TEXT_SAVED':
            return {
                ...state,
                lastSaved: action.payload,
                isDirty: false
            };
            
        case 'CLEAR_TEXT':
            return {
                text: '',
                lastSaved: Date.now(),
                isDirty: false
            };
            
        case 'RESTORE_SESSION':
            return {
                text: action.payload.text,
                lastSaved: action.payload.timestamp,
                isDirty: false
            };
            
        case 'SET_ERROR':
            // You might want to add error handling state here
            console.error(action.payload);
            return state;
            
        default:
            return state;
    }
}
