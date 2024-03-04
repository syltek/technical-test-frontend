import useSWR, { SWRConfiguration, Fetcher as SWRFetcher, SWRResponse } from 'swr'
import { useApiFetcher } from './useApiFetcher'
import { InferEndpointParams, InferEndpointResponse, KnownEndpoints } from './types'
import { useCallback } from 'react'

type Key<E extends KnownEndpoints> = [E, InferEndpointParams<E>]
type Data<E extends KnownEndpoints> = InferEndpointResponse<E>
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- We don't use the variable, but it is here for consistency
type Error<_ extends KnownEndpoints> = unknown

type Fetcher<E extends KnownEndpoints> = SWRFetcher<Data<E>, Key<E>>
type Options<E extends KnownEndpoints> = SWRConfiguration<Data<E>, Error<E>, Fetcher<E>>
type Response<E extends KnownEndpoints> = SWRResponse<Data<E>, Error<E>, Options<E>>

/**
 * Data fetching hook.
 * 
 * This is a wrapper around {@link useSWR} but types already baked in!
 *
 * @see https://swr.vercel.app/docs/api
 */
function useApiQuery<E extends KnownEndpoints>(
  /**
   * Any known endpoint in the format `{method} {pathname}`. Pathname params
   * should be wrapped in brackets.
   * 
   * See {@link EndpointMeta} for a full list of endpoints, their accepted parameters
   * and response types.
   * 
   * @example 
   * ```
   * "GET /v1/matches"
   * "GET /v1/matches/{matchId}"
   * ```
   */
  endpoint: E,
  /**
   * Parameters to pass to the endpoint. These can be query params or pathname-params;
   * the fetcher will properly use them in the correct place when building the full
   * URL for the request.
   * 
   * Pass false to omit the request.
   *
   * See {@link EndpointMeta} for a detailed list
   */
  params: InferEndpointParams<E> | false,
  /** 
   * Options for customizing the fetch behavior and its associated data.
   * @see https://swr.vercel.app/docs/api#options
   */
  options?: Options<E>
): Response<E> {
  const apiFetcher = useApiFetcher()

  const fetcher = useCallback<Fetcher<E>>(async (key) => {
    const [endpoint, params] = key
    const res = await apiFetcher(
      endpoint,
      /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any --
       * FIXME: Use a better type here if possible
       */
      params as any,
    )

    if (res.status >= 400) {
      throw new Error(`Wrong response from server: ${res.status}`)
    }

    return res.data as Data<E>
  }, [apiFetcher])

  const query = useSWR<Data<E>, Error<E>, Key<E> | false, Options<E>>(
    params ? [endpoint, params] : false,
    fetcher,
    options ?? {},
  )

  return query
}

export {
  useApiQuery,
  type Key,
  type Data,
  type Error,
  type Fetcher,
  type Options,
  type Response,
}
