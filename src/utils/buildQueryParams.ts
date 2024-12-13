export function buildQueryParams(params?: Record<string, string>): string {
  if (!params) return ""
  const query = new URLSearchParams(params).toString()
  return `?${query}`
}
