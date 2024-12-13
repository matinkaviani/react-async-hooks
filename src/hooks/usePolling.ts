import { useCallback, useEffect, useRef, useState } from "react"

type PollingOptions = {
  enabled?: boolean // Whether polling is active
}

type PollingState<T> = {
  data: T | null // The fetched data
  error: Error | null // Any error encountered during fetch
  loading: boolean // Whether a fetch is in progress
}

export function usePolling<T>(
  asyncFunction: () => Promise<T>, // Function to fetch data
  interval: number, // Polling interval in milliseconds
  options: PollingOptions = { enabled: true }
): PollingState<T> & { refetch: () => void } {
  const [state, setState] = useState<PollingState<T>>({
    data: null,
    error: null,
    loading: false,
  })

  const intervalIdRef = useRef<number | null>(null)
  const isMountedRef = useRef<boolean>(true)

  // Fetch the data and update state
  const fetchData = useCallback(async () => {
    if (!options.enabled) return

    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await asyncFunction()
      if (isMountedRef.current) {
        setState({ data, error: null, loading: false })
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        setState({ data: null, error, loading: false })
      }
    }
  }, [asyncFunction, options.enabled])

  // Manually trigger a refetch
  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  // Set up the polling interval
  useEffect(() => {
    if (options.enabled) {
      fetchData() // Initial fetch
      intervalIdRef.current = window.setInterval(fetchData, interval)
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
    }
  }, [interval, fetchData, options.enabled])

  // Cleanup on component unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return { ...state, refetch }
}
