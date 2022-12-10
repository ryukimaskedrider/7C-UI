import { AuthState } from './auth';

export * from './auth';

export const AppState = [
  AuthState
];

export const PersistAppState = {
  key: [
    'app.token',
    'app.rememberConsent',
    'app.isRefreshing',
  ]
};
