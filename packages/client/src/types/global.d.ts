declare interface Environment {
  VITE_AUTH_SERVICE: string;
}

declare interface Window {
  _env_: Environment;
}
