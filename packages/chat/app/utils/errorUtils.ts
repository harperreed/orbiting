export enum ErrorType {
  NETWORK = 'network',
  STORAGE = 'storage',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

export interface AppError extends Error {
  type: ErrorType;
  originalError?: unknown;
  userMessage?: string;
}

/**
 * Creates a standardized application error
 */
export function createError(
  type: ErrorType,
  message: string,
  originalError?: unknown,
  userMessage?: string
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;
  error.originalError = originalError;
  error.userMessage = userMessage;
  return error;
}

/**
 * Returns a user-friendly error message
 */
export function getUserFriendlyMessage(error: AppError): string {
  // Use custom user message if provided
  if (error.userMessage) {
    return error.userMessage;
  }

  // Default messages based on error type
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Network connection issue. Please check your internet connection and try again.';
    case ErrorType.STORAGE:
      return 'Unable to access storage. Your data may not be saved.';
    case ErrorType.VALIDATION:
      return 'Invalid input. Please check your information and try again.';
    case ErrorType.PERMISSION:
      return 'Permission denied. You may not have access to this feature.';
    case ErrorType.UNKNOWN:
    default:
      return 'Something went wrong. Please try again later.';
  }
}

/**
 * Logs error details to console for debugging
 */
export function logError(error: AppError): void {
  console.error(`[${error.type.toUpperCase()}] ${error.message}`, {
    originalError: error.originalError,
    stack: error.stack
  });
}
