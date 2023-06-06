declare interface Environment {
  VITE_AUTH_SERVICE: string;
  VITE_GOOGLE_CLIENT_ID: string;
}

declare interface Window {
  _env_: Environment;
}
