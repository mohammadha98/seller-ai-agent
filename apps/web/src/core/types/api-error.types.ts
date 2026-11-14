export type ApiErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown';

export interface ApiError {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly message: string;
  readonly validationErrors: readonly string[];
  readonly cause?: unknown;
}
