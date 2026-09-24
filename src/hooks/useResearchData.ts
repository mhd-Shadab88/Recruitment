import { useEffect, useState } from 'react'
import { loadDataBundle } from '../lib/dataLoader'
import { runResearch } from '../lib/research/researchEngine'
import type { ResearchRunResult } from '../lib/research/types'
import type { Source } from '../types'

const STORAGE_KEY_SOURCES = 'pid.researchSources.v1'
const STORAGE_KEY_LAST_RUN = 'pid.lastResearchRun.v1'

function readStoredSources(): Source[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SOURCES)
    return raw ? (JSON.parse(raw) as Source[]) : []
  } catch {
    return []
  }
}

function writeStoredSources(sources: Source[]) {
  try {
    localStorage.setItem(STORAGE_KEY_SOURCES, JSON.stringify(sources))
  } catch {
    // localStorage can be unavailable (private browsing, quota); the
    // research run itself still succeeds in-memory for this session.
  }
}

function readLastRun(): ResearchRunResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LAST_RUN)
    return raw ? (JSON.parse(raw) as ResearchRunResult) : null
  } catch {
    return null
  }
}

/**
 * Combines the seeded data/sources.json with any sources discovered by a
 * research run persisted to localStorage. This is a browser-only,
 * single-device demo persistence layer — a real deployment would persist
 * research runs server-side (see PROJECT_DECISIONS.md).
 */
export function useResearchData() {
  const bundle = loadDataBundle()
  const [runSources, setRunSources] = useState<Source[]>(() => readStoredSources())
  const [lastRun, setLastRun] = useState<ResearchRunResult | null>(() => readLastRun())
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    writeStoredSources(runSources)
  }, [runSources])

  const allSources = [...bundle.sources, ...runSources]

  async function runNow() {
    setIsRunning(true)
    setError(null)
    try {
      const { result, sources } = await runResearch(bundle.profile)
      setRunSources(sources)
      setLastRun(result)
      try {
        localStorage.setItem(STORAGE_KEY_LAST_RUN, JSON.stringify(result))
      } catch {
        // best-effort persistence only
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Research run failed.')
    } finally {
      setIsRunning(false)
    }
  }

  function setSourceStatus(id: string, status: Source['status']) {
    setRunSources((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)))
  }

  function resetRunSources() {
    setRunSources([])
    setLastRun(null)
    try {
      localStorage.removeItem(STORAGE_KEY_SOURCES)
      localStorage.removeItem(STORAGE_KEY_LAST_RUN)
    } catch {
      // best-effort
    }
  }

  return {
    bundle,
    allSources,
    runSources,
    lastRun,
    isRunning,
    error,
    runNow,
    setSourceStatus,
    resetRunSources,
  }
}
