// Core domain types shared across the data layer, research engine, and UI.

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'probably_not'

export type SourceType =
  | 'self_reported'
  | 'linkedin'
  | 'github'
  | 'personal_website'
  | 'article'
  | 'publication'
  | 'presentation'
  | 'social_profile'
  | 'project_page'
  | 'mention'
  | 'other'

/** A single provable statement, tied to where it came from. */
export interface Claim {
  id: string
  claim: string
  source: string
  url: string | null
  confidence: ConfidenceLevel
  last_verified: string // ISO date
  evidence: string
}

export interface CareerEntry {
  id: string
  title: string
  period: string
  summary: string
  claimIds: string[]
}

export interface ExpertiseArea {
  id: string
  label: string
  description: string
  claimIds: string[]
}

export interface Profile {
  name: string
  headline: string
  summary: string
  location: string
  focusAreas: string[]
  professionalInterests: string[]
  personalInterests: string[]
  career: CareerEntry[]
  expertise: ExpertiseArea[]
  lastResearchDate: string
}

export interface SkillItem {
  id: string
  name: string
  claimIds: string[]
}

export interface SkillCategory {
  id: string
  name: string
  description: string
  skills: SkillItem[]
}

export interface Project {
  id: string
  name: string
  tagline: string
  focus: string[]
  description: string
  status: 'active' | 'ongoing' | 'concept'
  claimIds: string[]
}

/** A discovered or seeded online source, with identity-confidence reasoning. */
export interface Source {
  id: string
  name: string
  url: string
  type: SourceType
  confidence: ConfidenceLevel
  confidenceRationale: string
  matchSignals: string[]
  description: string
  lastChecked: string // ISO date
  isDemo?: boolean
  status: 'accepted' | 'pending_review' | 'rejected'
}

export interface DataBundle {
  profile: Profile
  sources: Source[]
  projects: Project[]
  skillCategories: SkillCategory[]
  claims: Claim[]
}
