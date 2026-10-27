# WC2 Offline Notes App

A React and Vite progressive web app assessment project. Notes are saved locally in IndexedDB and the app shell and static assets are cached by a service worker for offline use.

## Run locally

Requirements: Node.js and npm.

```powershell
npm install
npm run dev
```

Open the local address printed by Vite. Build and preview the production version (recommended for offline testing) with:

```powershell
npm run build
npm run preview
```

## Main implementation files

- `src/db/openDB.js` opens `NotesDB` and creates the `notes` object store.
- `src/notes/AddNotes.js` adds a note to IndexedDB.
- `src/notes/GetNotes.js` reads all notes from IndexedDB.
- `src/App.jsx` implements the note-entry form, saved-note list, and connection status.
- `src/main.jsx` registers the service worker.
- `public/service-worker.js` precaches the app shell and caches same-origin static resources.
- `vite.config.js` configures the React plugin, development server, and preview server.

## Test offline storage and caching

1. Run `npm run build`, then `npm run preview`, and open Vite's preview URL.
2. Add a note and confirm it appears in the saved-notes list.
3. In browser developer tools, open **Application** (or **Storage**) and check **IndexedDB > NotesDB > notes**.
4. Check **Cache Storage > offline-notes-shell-v1** for the cached app shell and assets.
5. In developer tools' Network panel, switch to **Offline**, then reload the app. Confirm it loads and the saved note remains visible.
6. Switch back to **Online** when finished.

The assessment report and screenshots are submitted separately; this source project does not include them.

## Source and AI-use note

This project was prepared with AI assistance at the student's request. Follow the lecturer's current guidance and disclose AI assistance where required. Review and understand the implementation before submission.
