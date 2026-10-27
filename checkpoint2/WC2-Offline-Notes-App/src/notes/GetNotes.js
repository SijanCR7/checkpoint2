import { openDB, NOTES_STORE } from '../db/openDB.js';

export async function getAllNotes() {
  const database = await openDB();
  const transaction = database.transaction(NOTES_STORE, 'readonly');
  const request = transaction.objectStore(NOTES_STORE).getAll();

  const notes = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not read saved notes.'));
  });

  await new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(transaction.error || new Error('Reading notes was aborted.'));
    transaction.onerror = () => reject(transaction.error || new Error('Could not read saved notes.'));
  });

  return notes.sort((first, second) => second.id - first.id);
}
