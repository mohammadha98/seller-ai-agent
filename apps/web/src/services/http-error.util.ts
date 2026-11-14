import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, ApiErrorKind } from '../core/types';

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 0) {
    return 'network';
  }

  if (status === 400) {
    return 'validation';
  }

  if (status === 401) {
    return 'unauthorized';
  }

  if (status === 403) {
    return 'forbidden';
  }

  if (status === 404) {
    return 'not-found';
  }

  if (status === 409) {
    return 'conflict';
  }

  if (status >= 500) {
    return 'server';
  }

  return 'unknown';
}

function extractMessages(body: unknown): string[] {
  if (body == null) {
    return [];
  }

  if (typeof body === 'string') {
    return body.trim().length > 0 ? [body] : [];
  }

  if (typeof body === 'object') {
    const message = (body as { message?: unknown }).message;

    if (Array.isArray(message)) {
      return message
        .map((entry) => String(entry))
        .filter((entry) => entry.length > 0);
    }

    if (typeof message === 'string' && message.trim().length > 0) {
      return [message];
    }
  }

  return [];
}

function fallbackMessage(kind: ApiErrorKind): string {
  switch (kind) {
    case 'network':
      return 'Unable to reach the catalog service. Check your connection and try again.';
    case 'validation':
      return 'The request was rejected. Review the submitted values and try again.';
    case 'unauthorized':
      return 'You are not authorized to perform this action.';
    case 'forbidden':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested product could not be found.';
    case 'conflict':
      return 'The request conflicts with the current catalog state.';
    case 'server':
      return 'The catalog service encountered an error. Try again later.';
    default:
      return 'Something went wrong. Try again.';
  }
}

export function normalizeHttpError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    const kind = kindFromStatus(error.status);
    const messages = extractMessages(error.error);

    return {
      kind,
      status: error.status,
      message: messages[0] ?? (error.message || fallbackMessage(kind)),
      validationErrors: kind === 'validation' ? messages : [],
      cause: error,
    };
  }

  const message =
    error instanceof Error && error.message.length > 0
      ? error.message
      : fallbackMessage('unknown');

  return {
    kind: 'unknown',
    status: 0,
    message,
    validationErrors: [],
    cause: error,
  };
}
