export type SearchParamInput = Record<string, string | string[] | undefined>

export type NormalizedSearchParams = {
  q?: string
  prefecture?: string
  municipality?: string
  tags?: string
  jobCategory?: string
  sort?: "new"
  page?: string
}

const ALLOWED_KEYS = new Set([
  "q",
  "prefecture",
  "municipality",
  "tags",
  "jobCategory",
  "sort",
  "page",
])

const PARAM_ORDER: Array<keyof NormalizedSearchParams> = [
  "q",
  "prefecture",
  "municipality",
  "tags",
  "jobCategory",
  "sort",
  "page",
]

const getFirstValue = (value: string | string[] | undefined): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

const normalizeTags = (value: string | undefined): string | undefined => {
  if (!value) return undefined

  const tags = value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)

  if (tags.length === 0) return undefined

  return Array.from(new Set(tags)).join(",")
}

export const normalizeSearchParams = (input: SearchParamInput): {
  normalized: NormalizedSearchParams
  requiresRedirect: boolean
} => {
  const normalized: NormalizedSearchParams = {}
  let requiresRedirect = false

  for (const key of Object.keys(input)) {
    if (!ALLOWED_KEYS.has(key)) {
      requiresRedirect = true
    }
  }

  const q = getFirstValue(input.q)?.trim()
  if (q) normalized.q = q
  if (input.q && !q) requiresRedirect = true

  const prefecture = getFirstValue(input.prefecture)?.trim()
  if (prefecture) normalized.prefecture = prefecture
  if (input.prefecture && !prefecture) requiresRedirect = true

  const municipality = getFirstValue(input.municipality)?.trim()
  if (municipality) normalized.municipality = municipality
  if (input.municipality && !municipality) requiresRedirect = true

  const tags = normalizeTags(getFirstValue(input.tags))
  if (tags) normalized.tags = tags
  if (input.tags && !tags) requiresRedirect = true

  const jobCategory = getFirstValue(input.jobCategory)?.trim()
  if (jobCategory) normalized.jobCategory = jobCategory
  if (input.jobCategory && !jobCategory) requiresRedirect = true

  const rawSort = getFirstValue(input.sort)?.trim()
  if (rawSort === "new") {
    normalized.sort = "new"
  } else if (rawSort === "recommended" || !rawSort) {
    if (rawSort === "recommended") {
      requiresRedirect = true
    }
  } else {
    requiresRedirect = true
  }

  const rawPage = getFirstValue(input.page)?.trim()
  if (rawPage) {
    const pageNumber = Number.parseInt(rawPage, 10)
    if (Number.isFinite(pageNumber) && pageNumber > 1) {
      normalized.page = String(pageNumber)
      if (String(pageNumber) !== rawPage) {
        requiresRedirect = true
      }
    } else {
      requiresRedirect = true
    }
  }

  const normalizedParams = new URLSearchParams()
  for (const key of PARAM_ORDER) {
    const value = normalized[key]
    if (value) {
      normalizedParams.set(key, value)
    }
  }

  const normalizedQuery = normalizedParams.toString()
  const rawQuery = new URLSearchParams()
  for (const [key, value] of Object.entries(input)) {
    const first = getFirstValue(value)
    if (first !== undefined) {
      rawQuery.set(key, first)
    }
  }

  if (rawQuery.toString() !== normalizedQuery) {
    requiresRedirect = true
  }

  return { normalized, requiresRedirect }
}

export const toSearchQueryString = (params: NormalizedSearchParams): string => {
  const searchParams = new URLSearchParams()
  for (const key of PARAM_ORDER) {
    const value = params[key]
    if (value) {
      searchParams.set(key, value)
    }
  }
  return searchParams.toString()
}

export const hasSearchQuery = (params: NormalizedSearchParams): boolean => {
  return Boolean(
    params.q ||
    params.prefecture ||
    params.municipality ||
    params.tags ||
    params.jobCategory ||
    params.sort ||
    params.page
  )
}
