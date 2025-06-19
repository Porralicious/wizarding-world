// src/utils/indexedDbPersister.ts
import { openDB } from 'idb'
import type { PersistedClient, Persister } from '@tanstack/query-persist-client-core'

const DB_NAME = 'tanstack-query'
const STORE_NAME = 'queries'

export const createIndexedDBPersister = (): Persister => {
  return {
    persistClient: async (client: PersistedClient) => {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME)
        },
      })
      await db.put(STORE_NAME, client, 'client')
    },

    restoreClient: async () => {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME)
        },
      })
      return db.get(STORE_NAME, 'client')
    },

    removeClient: async () => {
      const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME)
        },
      })
      await db.delete(STORE_NAME, 'client')
    },
  }
}
