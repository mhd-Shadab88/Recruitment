import profileJson from '../data/profile.json'
import sourcesJson from '../data/sources.json'
import projectsJson from '../data/projects.json'
import skillsJson from '../data/skills.json'
import claimsJson from '../data/claims.json'
import type { DataBundle, Claim, Profile, Project, SkillCategory, Source } from '../types'

/**
 * Single point of access to the static data layer. Keeping this as one
 * module (rather than importing the JSON files all over the UI) means the
 * data source can later be swapped for an API/backend without touching
 * components.
 */
export function loadDataBundle(): DataBundle {
  return {
    profile: profileJson as Profile,
    sources: sourcesJson as Source[],
    projects: projectsJson as Project[],
    skillCategories: skillsJson as SkillCategory[],
    claims: claimsJson as Claim[],
  }
}

export function getClaimsByIds(claims: Claim[], ids: string[]): Claim[] {
  const byId = new Map(claims.map((c) => [c.id, c]))
  return ids.map((id) => byId.get(id)).filter((c): c is Claim => Boolean(c))
}
