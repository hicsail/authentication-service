window._env_ = {} as Environment
export const env: Environment = window._env_;

export const loadEnv = async () => {
  let env: Environment = {
    VITE_AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE
  };
  try {
    const response = await fetch('/env.json');
    Object.assign(await response.json(), env);
  } catch (e) {
    console.error('Failed to load environment variables');
  }
  window._env_ = env;
}
