// Thin wrappers so a blocked or full localStorage never crashes the app.
// Only the theme and the optional writing sample are stored. Conversations never are.

export function readStored(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore: the app works without saving.
  }
}

export function removeStored(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore.
  }
}
