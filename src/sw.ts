import { cacheNames, skipWaiting, clientsClaim } from 'workbox-core'
import { getCacheKeyForURL, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { strategy as composeStrategies } from 'workbox-streams'

precacheAndRoute((self as any).__WB_MANIFEST)

skipWaiting()
clientsClaim()

const shellStrategy = new CacheFirst({ cacheName: cacheNames.precache })
const contentStrategy = new StaleWhileRevalidate({ cacheName: 'content' })

const navigationHandler = composeStrategies(
  [
    () =>
      shellStrategy.handle({
        request: new Request(getCacheKeyForURL('/shell-start.html')!),
      }),
    ({ url }) =>
      contentStrategy.handle({
        request: new Request(url!.pathname + 'index.partial.html'),
      }),
    () =>
      shellStrategy.handle({
        request: new Request(getCacheKeyForURL('/shell-end.html')!),
      }),
  ],
  {}
)

registerRoute(
  ({ url }) => url.pathname.endsWith('.webm') || url.pathname.endsWith('.ts'),
  new CacheFirst()
)

registerRoute(({ request }) => request.mode === 'navigate', navigationHandler)

precacheAndRoute((self as any).__precacheManifest || [])
