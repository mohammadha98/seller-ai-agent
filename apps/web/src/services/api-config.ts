import { InjectionToken, Provider } from '@angular/core';

export interface ApiConfig {
  readonly baseUrl: string;
}

export const DEFAULT_API_BASE_URL = 'http://localhost:3000';

export const API_CONFIG = new InjectionToken<ApiConfig>('API_CONFIG', {
  providedIn: 'root',
  factory: () => ({ baseUrl: DEFAULT_API_BASE_URL }),
});

export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '');
}

export function provideApiConfig(config: Partial<ApiConfig>): Provider {
  return {
    provide: API_CONFIG,
    useValue: {
      baseUrl: normalizeBaseUrl(config.baseUrl ?? DEFAULT_API_BASE_URL),
    },
  };
}
