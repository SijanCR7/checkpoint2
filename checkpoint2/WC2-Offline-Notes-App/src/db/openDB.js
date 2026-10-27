const DATABASE_NAME = 'NotesDB';
const DATABASE_VERSION = 1;
export const NOTES_STORE = 'notes';

let databasePromise;

export function openDB() {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this browser.'));
  }

  if (databasePromise) return databasePromise;

  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      // Create the store on first use without replacing notes during future upgrades.
      if (!database.objectStoreNames.contains(NOTES_STORE)) {
        database.createObjectStore(NOTES_STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        databasePromise = undefined;
      };
      resolve(database);
    };

    request.onerror = () => {
      databasePromise = undefined;
      reject(request.error || new Error('Could not open the NotesDB database.'));
    };

    request.onblocked = () => {
      databasePromise = undefined;
      reject(new Error('NotesDB upgrade is blocked. Close other app tabs and try again.'));
    };
  });

  return databasePromise;
}
