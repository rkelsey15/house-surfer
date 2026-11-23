import { deleteAllPhotos } from './photoDb.js'
import { clearAllData } from './storage.js'

// Wipe everything House Surfer saved on this device and start again as a
// first-time visitor. Reloading is the simplest way to reset every context.
export async function resetDemo() {
  clearAllData()
  // Saved photos (IndexedDB) go too.
  await deleteAllPhotos()
  window.location.hash = '#/'
  window.location.reload()
}
