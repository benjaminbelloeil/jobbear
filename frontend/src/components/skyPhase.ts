export type SkyPhase = 'sunrise' | 'day' | 'sunset' | 'night'

/** Which sky goes with an hour of the day (0–23). */
export function skyPhase(hour: number): SkyPhase {
  if (hour >= 5 && hour < 9) return 'sunrise'
  if (hour >= 9 && hour < 17) return 'day'
  if (hour >= 17 && hour < 20) return 'sunset'
  return 'night'
}
