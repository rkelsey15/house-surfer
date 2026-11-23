// Photos live in IndexedDB (the browser's bigger store), on this device only.
// Database "house-surfer", store "photos". Each row:
//   { id, home_id, blob, created_at }
// Each call opens and closes its own connection, so "Reset demo" can delete
// the whole database without anything holding it open.
const DB_NAME = 'house-surfer'
const STORE = 'photos'

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no-indexeddb'))
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: 'id' })
      store.createIndex('home_id', 'home_id')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run(mode, work) {
  const db = await openDb()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode)
      let result
      Promise.resolve(work(tx.objectStore(STORE))).then((r) => (result = r))
      tx.oncomplete = () => resolve(result)
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error)
    })
  } finally {
    db.close()
  }
}

const request = (req) =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `p${Date.now()}${Math.random().toString(16).slice(2)}`)

export async function savePhoto(home_id, blob) {
  const row = { id: newId(), home_id, blob, created_at: new Date().toISOString() }
  await run('readwrite', (store) => request(store.add(row)))
  return row
}

export const listPhotos = () => run('readonly', (store) => request(store.getAll()))

// Removes every saved photo by deleting the database.
export function deleteAllPhotos() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve()
    const req = indexedDB.deleteDatabase(DB_NAME)
    req.onsuccess = req.onerror = req.onblocked = () => resolve()
    setTimeout(resolve, 1500)
  })
}
