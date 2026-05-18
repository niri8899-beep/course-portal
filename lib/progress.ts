import { TOTAL_LESSONS } from './courseData'

export async function fetchCompleted(email: string): Promise<Set<string>> {
  try {
    const res = await fetch(`/api/progress?email=${encodeURIComponent(email)}`)
    if (!res.ok) return new Set()
    const data = await res.json()
    return new Set((data.completed ?? []) as string[])
  } catch {
    return new Set()
  }
}

export async function markComplete(
  email: string,
  moduleId: number,
  lessonId: number
): Promise<void> {
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, moduleId, lessonId }),
    })
  } catch {
    /* network error — caller already updated UI optimistically */
  }
}

export function isInSet(set: Set<string>, moduleId: number, lessonId: number): boolean {
  return set.has(`${moduleId}_${lessonId}`)
}

export function overallPercent(set: Set<string>): number {
  return Math.round((set.size / TOTAL_LESSONS) * 100)
}

export function modulePercent(set: Set<string>, moduleId: number, total: number): number {
  let count = 0
  for (let i = 1; i <= total; i++) {
    if (set.has(`${moduleId}_${i}`)) count++
  }
  return Math.round((count / total) * 100)
}
