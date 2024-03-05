interface Auth {
  /**
   * Currently logged-in user information or `null` if there is no logged-in user.
   * 
   * This value might be `undefined` if we don't know yet if the user is logged
   * in or not. This might happen at the beginning of the application life-cycle
   * when we are checking if the token we have is valid.
   * 
   * Note: once this value transitions from `undefined` into any other value; it will
   * never go-back into being `undefined` again
   */
  currentUser: undefined | null | {
    userId: string
    name: string
    email: string
  }

  /**
   * Currently logged-in user token information or `null` if there isn't any.
   * 
   * This value might be `undefined` if we don't know yet if the user is logged
   * in or not. This might happen at the beginning of the application life-cycle
   * when we are checking if the token we have is valid.
   * 
   * Note: once this value transitions from `undefined` into any other value; it will
   * never go-back into being `undefined` again
   */
  tokens: undefined | null | TokensData

  /**
   * Attempts to log in with the provided information. If successful; this will also
   * cause an update on the `currentUser` and `tokens` properties of the auth state.
   * 
   * Internally; this method will call the auth endpoint `POST /v3/auth/login` with
   * the provided email and password to retrieve and store {@link Auth.tokens}. If
   * the auth call is successful, it does an extra call to `GET /v1/users/me`
   * with the received access token to load the {@link Auth.currentUser}
   * 
   * @throws {Error} if there is a user already logged in
   * @throws {Error} if credentials are wrong
   */
  login(data: { email: string, password: string }): Promise<void>


  /**
   * Logs out the currently logged-in. If successful; this will also  cause an update
   * on the `currentUser` and `tokens` properties of the auth state.
   * 
   * @throws {Error} if there is no user logged in
   */
  logout(): Promise<void>
}

interface AuthInitializeConfig {
  /**
   * Allows initializing the Auth state with a previously stored set of tokens. This allows
   * persisting a user "session" so the next time the come around they don't need to re-enter
   * their credentials.
   */
  tokens?: TokensData | Promise<TokensData> | null | undefined

  /**
   * Allows listening for auth state changes; allowing other parts of the application to store it
   * so it can be later used for re-initializing the auth after a refresh via {@link AuthInitializeConfig.tokens}
   * 
   * The auth state (in this case the tokens) might change during runtime of the application:
   *
   * - When the user logs in; this callback is invoked with the freshly created auth token information
   * - When the user logs out; this callback is invoked with null
   * - While the user is using the application the access token might expire; causing the
   *   `AuthProvider` to automatically refresh the auth token information. That just-refreshed tokens
   *   will be passed to this callback.
   */
  onAuthChange?: (tokens: TokensData | null) => void
}

interface TokensData {
  /**
   * Token identifying the currently logged-in user; allowing them to do calls
   * to the API that require authorization.
   * 
   * This token expires at the date specified by `accessExpiresAt`.
   */
  access: string

  /**
   * Expiration date of the `access` token. Once expired; the `access` token is no
   * longer valid and a new token needs to be issued by requesting it to the API
   * using the `refresh` token.
   * 
   * [ISO DateTime](https://en.wikipedia.org/wiki/ISO_8601) format.
   */
  accessExpiresAt: string

  /**
   * Token allowing the currently logged-in user to "extend" it `access` token; by
   * issuing a new one with a new expiration.
   * 
   * This token expires at the date specified by `refreshExpiresAt`.
   */
  refresh: string

  /**
   * Expiration date of the `refresh` token. Once expired; the `refresh` token is no
   * longer valid and the user needs to enter their credentials again.
   * 
   * [ISO DateTime](https://en.wikipedia.org/wiki/ISO_8601) format.
   */
  refreshExpiresAt: string
}

export {
  type Auth,
  type AuthInitializeConfig,
}
