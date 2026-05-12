import { TOTAL_LESSONS } from './courseData'

function key(email: string) {
  return `cp_progress_${email.toLowerCase()}`
}

export function getCompletedSet(email: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const arr = JSON.parse(localStorage.getItem(key(email)) ?? '[]') as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

export function markComplete(email: string, moduleId: number, lessonId: number) {
  const set = getCompletedSet(email)
  set.add(`${moduleId}_${lessonId}`)
  localStorage.setItem(key(email), JSON.stringify(Array.from(set)))
}

export function isComplete(email: string, moduleId: number, lessonId: number): boolean {
  return getCompletedSet(email).has(`${moduleId}_${lessonId}`)
}

export function overallPercent(email: string): number {
  const size = getCompletedSet(email).size
  return Math.round((size / TOTAL_LESSONS) * 100)
}

export function modulePercent(email: string, moduleId: number, total: number): number {
  const set = getCompletedSet(email)
  let count = 0
  for (let i = 1; i <= total; i++) {
    if (set.has(`${moduleId}_${i}`)) count++
  }
  return Math.round((count / total) * 100)
}
