import { openDB, NOTES_STORE } from '../db/openDB.js';

export async function addNote(content) {
  const normalizedContent = content.trim();
  if (!normalizedContent) {
    throw new Error('A note cannot be empty.');
  }

  const database = await openDB();
  const transaction = database.transaction(NOTES_STORE, 'readwrite');
  const store = transaction.objectStore(NOTES_STORE);
  const note = {
    content: normalizedContent,
    createdAt: new Date().toISOString(),
  };
  const request = store.add(note);

  const id = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Could not add the note.'));
  });

  await new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(transaction.error || new Error('Saving the note was aborted.'));
    transaction.onerror = () => reject(transaction.error || new Error('Could not save the note.'));
  });

  return { ...note, id };
}
