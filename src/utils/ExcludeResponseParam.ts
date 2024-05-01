// Exclude keys from an object
export function excludeFromObject<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return Object.fromEntries(Object.entries(obj as any).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>
}

// Exclude keys from objects in a list
export function excludeFromList<T, K extends keyof T>(objects: T[], keysToDelete: K[]): Omit<T, K>[] {
  return objects.map((obj) => excludeFromObject(obj, keysToDelete)) as Omit<T, K>[]
}
