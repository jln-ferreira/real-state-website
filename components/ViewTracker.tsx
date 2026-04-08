'use client'

import { useEffect } from 'react'

export default function ViewTracker({ endpoint }: { endpoint: string }) {
  useEffect(() => {
    fetch(endpoint, { method: 'POST' }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
