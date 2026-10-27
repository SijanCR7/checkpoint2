import { useEffect, useState } from 'react';
import { addNote } from './notes/AddNotes.js';
import { getAllNotes } from './notes/GetNotes.js';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState(() =>
    'serviceWorker' in navigator
      ? 'Checking offline support…'
      : 'This browser does not support service workers.',
  );

  useEffect(() => {
    let isMounted = true;

    const loadNotes = async () => {
      try {
        const savedNotes = await getAllNotes();
        if (isMounted) setNotes(savedNotes);
      } catch (loadError) {
        console.error('Could not load notes from IndexedDB.', loadError);
        if (isMounted) {
          setError('Saved notes could not be loaded. Check browser storage and reload.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    const updateServiceWorkerStatus = (event) => setServiceWorkerStatus(event.detail);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('offline-notes:service-worker', updateServiceWorkerStatus);

    loadNotes();

    return () => {
      isMounted = false;
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('offline-notes:service-worker', updateServiceWorkerStatus);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = draft.trim();

    if (!content) {
      setError('Write a note before saving.');
      setMessage('');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      await addNote(content);
      setNotes(await getAllNotes());
      setDraft('');
      setMessage('Note saved on this device.');
    } catch (saveError) {
      console.error('Could not save note to IndexedDB.', saveError);
      setError('The note could not be saved. Check browser storage and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">PRIVATE BY DESIGN · STORED ON THIS DEVICE</p>
          <h1>Offline Notes</h1>
          <p className="intro">
            Capture a thought now. Your notes stay available, even when your connection does not.
          </p>
        </div>
        <div className={`connection-status ${isOnline ? 'is-online' : 'is-offline'}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </header>

      <p className="service-worker-status" role="status" aria-live="polite">
        {serviceWorkerStatus}
      </p>

      <section className="composer" aria-labelledby="composer-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR SPACE</p>
            <h2 id="composer-title">Write a note</h2>
          </div>
          <span className="note-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="note-content">Note text</label>
          <textarea
            id="note-content"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What would you like to remember?"
            rows={5}
            maxLength={2000}
          />
          <div className="composer-footer">
            <span className="character-count">{draft.length}/2000</span>
            <button type="submit" disabled={isSaving || !draft.trim()}>
              {isSaving ? 'Saving…' : 'Save note'}
            </button>
          </div>
        </form>

        {error && <p className="feedback feedback-error" role="alert">{error}</p>}
        {message && <p className="feedback feedback-success" role="status">{message}</p>}
      </section>

      <section className="notes-section" aria-labelledby="notes-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SAVED LOCALLY</p>
            <h2 id="notes-title">Your notes</h2>
          </div>
        </div>

        {isLoading ? (
          <p className="empty-state">Loading your saved notes…</p>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✳</span>
            <h3>A little room for a first thought</h3>
            <p>Your saved notes will appear here and remain on this device.</p>
          </div>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li className="note-card" key={note.id}>
                <p className="note-content">{note.content}</p>
                <time className="note-date" dateTime={note.createdAt}>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(note.createdAt))}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="app-footer">
        Notes are saved in this browser using IndexedDB. No account or network is needed.
      </footer>
    </main>
  );
}

export default App;
