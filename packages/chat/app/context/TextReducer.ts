import { StoredMessage } from '../utils/storageUtils';

export interface TextState {
    text: string;
    lastSaved: number | null;
    isDirty: boolean;
}

export type TextAction = 
    | { type: 'SET_TEXT'; payload: string }
    | { type: 'TEXT_SAVED'; payload: number }
    | { type: 'CLEAR_TEXT' }
    | { type: 'RESTORE_SESSION'; payload: StoredMessage }
    | { type: 'SET_ERROR'; payload: string };

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
