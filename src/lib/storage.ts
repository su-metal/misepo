export const storageKey = (base: string, uid: string | null) => {
  return uid ? `${base}_${uid}` : `${base}_guest`;
};

export function readFromStorage<T>(base: string, uid: string | null): T | null {
  if (typeof window === 'undefined') return null;
  const key = storageKey(base, uid);
  const val = localStorage.getItem(key);
  if (!val) return null;
  try {
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

export function writeToStorage(base: string, uid: string | null, value: any) {
  if (typeof window === 'undefined') return;
  const key = storageKey(base, uid);
  localStorage.setItem(key, JSON.stringify(value));
}

export function hasShownStartBonus(uid: string | null) {
  return readFromStorage<boolean>('has_shown_start_bonus', uid);
}

export function markStartBonusShown(uid: string | null) {
  writeToStorage('has_shown_start_bonus', uid, true);
}
