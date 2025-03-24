/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Whether or not we allow accessing the app and api without credentials.
   *
   * You can set this variable via `.env` file to skip the login.
   *
   * This might be useful if you want to start with task02 without doing
   * task01 first.
   */
  readonly VITE_ALLOW_ANONYMOUS_ACCESS: string
}
