'use client'

import NextTopLoader from 'nextjs-toploader'

export default function TopLoader() {
  return (
    <NextTopLoader
      color="#6D6D85"
      height={3}
      showSpinner={false}
      easing="ease"
      speed={250}
      shadow="0 0 10px #6D6D85, 0 0 5px #6D6D85"
    />
  )
}
