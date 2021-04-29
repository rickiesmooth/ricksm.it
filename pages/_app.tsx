import React from 'react'
import { useRouter } from 'next/router'

import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  React.useEffect(() => {
    function handleRouteChange() {
      const isProd = window.location.hostname.includes('ricksm.it')
      if (isProd) window.fetch('https://analytics.ricksm.it/track')
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // first page view
    handleRouteChange()

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
