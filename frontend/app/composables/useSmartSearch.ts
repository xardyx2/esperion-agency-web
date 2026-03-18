/**
 * useSmartSearch - Composable for advanced search with operators
 * 
 * Supports operators:
 * - "exact phrase" - exact phrase matching
 * - status:draft - field:value filtering
 * - category:services - category filtering
 * - author:admin - author filtering
 * - before:2024-01-01 - date before
 * - after:2024-01-01 - date after
 * - views:>100 - numeric comparison
 * - views:<1000 - numeric less than
 * 
 * @usage
 * ```vue
 * const { query, parsedQuery, recentSearches, executeSearch } = useSmartSearch({
 *   onSearch: (parsed) => fetchResults(parsed)
 * })
 * ```
 */

export interface SearchOperator {
  type: 'field' | 'phrase' | 'date' | 'numeric'
  field?: string
  value: string | number | boolean
  operator?: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'before' | 'after'
}

export interface ParsedQuery {
  original: string
  operators: SearchOperator[]
  textTerms: string[]
  isAdvanced: boolean
}

export interface UseSmartSearchOptions {
  debounceMs?: number
  maxRecentSearches?: number
  onSearch?: (parsed: ParsedQuery) => void | Promise<void>
  persistKey?: string
}

const RECENT_SEARCHES_KEY = 'esperion:recent-searches'

export const useSmartSearch = (options: UseSmartSearchOptions = {}) => {
  const {
    debounceMs = 300,
    maxRecentSearches = 10,
    onSearch,
    persistKey
  } = options

  const query = ref('')
  const isSearching = ref(false)
  const parsedQuery = ref<ParsedQuery>({
    original: '',
    operators: [],
    textTerms: [],
    isAdvanced: false
  })

  // Load recent searches from localStorage
  const recentSearches = ref<string[]>([])
  
  onMounted(() => {
    if (typeof window !== 'undefined') {
      const key = persistKey || RECENT_SEARCHES_KEY
      const stored = localStorage.getItem(key)
      if (stored) {
        try {
          recentSearches.value = JSON.parse(stored)
        } catch {
          recentSearches.value = []
        }
      }
    }
  })

  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    // Remove if exists
    recentSearches.value = recentSearches.value.filter(s => s !== searchQuery)
    // Add to front
    recentSearches.value.unshift(searchQuery)
    // Limit to max
    if (recentSearches.value.length > maxRecentSearches) {
      recentSearches.value = recentSearches.value.slice(0, maxRecentSearches)
    }
    
    // Persist
    if (typeof window !== 'undefined') {
      const key = persistKey || RECENT_SEARCHES_KEY
      localStorage.setItem(key, JSON.stringify(recentSearches.value))
    }
  }

  const clearRecentSearches = () => {
    recentSearches.value = []
    if (typeof window !== 'undefined') {
      const key = persistKey || RECENT_SEARCHES_KEY
      localStorage.removeItem(key)
    }
  }

  // Parser
  const parseQuery = (input: string): ParsedQuery => {
    const result: ParsedQuery = {
      original: input,
      operators: [],
      textTerms: [],
      isAdvanced: false
    }

    if (!input.trim()) return result

    let remaining = input

    // Match quoted phrases: "exact phrase"
    const phraseRegex = /"([^"]*)"/g
    let match
    while ((match = phraseRegex.exec(input)) !== null) {
      result.operators.push({
        type: 'phrase',
        value: match[1]
      })
      remaining = remaining.replace(match[0], '')
      result.isAdvanced = true
    }

    // Match field operators: field:value
    const fieldRegex = /(\w+):([^\s]+)/g
    while ((match = fieldRegex.exec(input)) !== null) {
      const field = match[1]
      const value = match[2]
      
      // Check for numeric operators
      if (value.startsWith('>')) {
        result.operators.push({
          type: 'numeric',
          field,
          value: parseFloat(value.slice(1)),
          operator: 'gt'
        })
      } else if (value.startsWith('<')) {
        result.operators.push({
          type: 'numeric',
          field,
          value: parseFloat(value.slice(1)),
          operator: 'lt'
        })
      } else if (field === 'before' || field === 'after') {
        result.operators.push({
          type: 'date',
          field,
          value,
          operator: field === 'before' ? 'before' : 'after'
        })
      } else {
        result.operators.push({
          type: 'field',
          field,
          value
        })
      }
      
      result.isAdvanced = true
    }

    // Remaining text terms
    result.textTerms = remaining
      .split(/\s+/)
      .filter(t => t.length > 0)

    return result
  }

  // Debounced search execution
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const executeSearch = async (searchQuery?: string) => {
    const q = searchQuery ?? query.value
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(async () => {
      isSearching.value = true
      parsedQuery.value = parseQuery(q)

      if (q.trim()) {
        saveRecentSearch(q)
      }

      if (onSearch) {
        await onSearch(parsedQuery.value)
      }

      isSearching.value = false
    }, debounceMs)
  }

  const setQuery = (value: string) => {
    query.value = value
    executeSearch(value)
  }

  const clearQuery = () => {
    query.value = ''
    parsedQuery.value = {
      original: '',
      operators: [],
      textTerms: [],
      isAdvanced: false
    }
  }

  // Generate search suggestions based on query
  const getSuggestions = (partial: string): string[] => {
    const suggestions: string[] = []
    
    // Field suggestions
    if (partial.endsWith('status:')) {
      suggestions.push('status:draft', 'status:published', 'status:archived')
    } else if (partial.endsWith('category:')) {
      suggestions.push('category:blog', 'category:news', 'category:tutorial')
    }
    
    // Recent searches that match
    const matches = recentSearches.value.filter(s => 
      s.toLowerCase().includes(partial.toLowerCase())
    )
    suggestions.push(...matches)
    
    return suggestions.slice(0, 5)
  }

  return {
    query: readonly(query),
    parsedQuery: readonly(parsedQuery),
    isSearching: readonly(isSearching),
    recentSearches: readonly(recentSearches),
    setQuery,
    executeSearch,
    clearQuery,
    clearRecentSearches,
    getSuggestions,
    parseQuery
  }
}

export default useSmartSearch
