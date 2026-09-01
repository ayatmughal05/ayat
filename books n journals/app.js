/* ============================================================
   MY READING SPACE — app.js
   Full application logic: routing, books, notes, documents,
   favorites, localStorage, dark mode, animations.
   ============================================================ */

'use strict';

/* ── State ──────────────────────────────────────────────── */
let state = {
  books:     [],
  notes:     [],
  documents: [],
  settings:  { darkMode: false }
};

// Active selections
let currentFilter    = 'all';
let currentNoteId    = null;
let currentDocId     = null;
let currentBookColor = '#e8a87c';
let noteAutosaveTimer = null;
let docAutosaveTimer  = null;

/* ── localStorage helpers ───────────────────────────────── */
function loadState() {
  try {
    const saved = localStorage.getItem('readingSpaceState');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.books     = parsed.books     || [];
      state.notes     = parsed.notes     || [];
      state.documents = parsed.documents || [];
      state.settings  = parsed.settings  || { darkMode: false };
    }
  } catch(e) { console.warn('Could not load state', e); }
}

function saveState() {
  try { localStorage.setItem('readingSpaceState', JSON.stringify(state)); }
  catch(e) { console.warn('Could not save state', e); }
}

/* ── IDs & dates ────────────────────────────────────────── */
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ════════════════════════════════════════════════════════
   ROUTING / PAGE NAVIGATION
════════════════════════════════════════════════════════ */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const navBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add('active');

  // Render the right page
  switch(pageId) {
    case 'home':      renderHome();      break;
    case 'library':   renderLibrary();   break;
    case 'notes':     renderNotes();     break;
    case 'documents': renderDocuments(); break;
    case 'favorites': renderFavorites(); break;
  }

  // Close mobile sidebar
  closeMobileSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════════════════════════
   HOME PAGE
════════════════════════════════════════════════════════ */
function renderHome() {
  renderStats();
  renderRecentBooks();
}

function renderStats() {
  const el = document.getElementById('homeStats');
  if (!el) return;
  const total     = state.books.length;
  const completed = state.books.filter(b => b.status === 'completed').length;
  const reading   = state.books.filter(b => b.status === 'reading').length;
  const notes     = state.notes.length;

  el.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon">📚</div>
      <div class="stat-number">${total}</div>
      <div class="stat-label">Books in Library</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div class="stat-number">${completed}</div>
      <div class="stat-label">Completed</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">📖</div>
      <div class="stat-number">${reading}</div>
      <div class="stat-label">Currently Reading</div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">✍️</div>
      <div class="stat-number">${notes}</div>
      <div class="stat-label">Notes Written</div>
    </div>
  `;
}

function renderRecentBooks() {
  const el = document.getElementById('recentBooks');
  if (!el) return;
  const recent = [...state.books].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  if (recent.length === 0) {
    el.innerHTML = '<div style="color:var(--text3);font-size:0.9rem">No books yet — add your first book!</div>';
    return;
  }
  el.innerHTML = recent.map(bookCardHTML).join('');
}

/* ════════════════════════════════════════════════════════
   LIBRARY PAGE
════════════════════════════════════════════════════════ */
function renderLibrary() {
  filterLibrary();
}

function setFilter(btn, filter) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = filter;
  filterLibrary();
}

function filterLibrary() {
  const query  = (document.getElementById('librarySearch')?.value || '').toLowerCase();
  const filter = currentFilter;
  const grid   = document.getElementById('libraryGrid');
  const empty  = document.getElementById('libraryEmpty');
  if (!grid) return;

  let books = state.books;
  if (filter !== 'all') books = books.filter(b => b.status === filter);
  if (query)            books = books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query) ||
    (b.genre || '').toLowerCase().includes(query)
  );

  if (books.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    grid.innerHTML = books.map(bookCardHTML).join('');
  }
}

/* ════════════════════════════════════════════════════════
   BOOK CARD HTML
════════════════════════════════════════════════════════ */
function bookCardHTML(book) {
  const favDot = book.favorite ? '<span class="fav-dot">⭐</span>' : '';
  const progress = book.pages > 0
    ? Math.min(100, Math.round((book.pagesRead / book.pages) * 100)) : 0;
  const favCls = book.favorite ? ' favorited' : '';

  return `
    <div class="book-card${favCls}" onclick="openBook('${book.id}')">
      <div class="book-cover" style="background:${book.color}">
        <div class="book-cover-spine"></div>
        ${book.emoji ? `<span>${book.emoji}</span>` : `<span style="font-size:1.4rem;font-family:var(--font-serif);font-style:italic;color:rgba(255,255,255,0.85);padding:8px;text-align:center">${book.title.slice(0,20)}</span>`}
      </div>
      <div class="book-card-body">
        <div class="book-card-title">${escapeHtml(book.title)}</div>
        <div class="book-card-author">${escapeHtml(book.author)}</div>
        <span class="status-badge ${book.status}">${statusLabel(book.status)}</span>
        ${favDot}
        ${book.status === 'reading' && book.pages > 0
          ? `<div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:${progress}%"></div></div>`
          : ''}
      </div>
    </div>`;
}

function statusLabel(s) {
  return s === 'reading' ? 'Reading' : s === 'completed' ? 'Completed' : 'Wishlist';
}

/* ════════════════════════════════════════════════════════
   ADD BOOK
════════════════════════════════════════════════════════ */
function selectColor(btn) {
  document.querySelectorAll('.color-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  currentBookColor = btn.dataset.color;
}

function addBook() {
  const title  = document.getElementById('bookTitle')?.value.trim();
  const author = document.getElementById('bookAuthor')?.value.trim();
  if (!title || !author) { showToast('Please enter a title and author.'); return; }

  const status  = document.querySelector('input[name="bookStatus"]:checked')?.value || 'reading';
  const pages   = parseInt(document.getElementById('bookPages')?.value) || 0;
  const pagesRead = Math.min(parseInt(document.getElementById('bookPagesRead')?.value) || 0, pages);
  const genre   = document.getElementById('bookGenre')?.value.trim() || '';
  const desc    = document.getElementById('bookDesc')?.value.trim() || '';
  const emoji   = document.getElementById('bookEmoji')?.value.trim() || '';

  const book = {
    id: uid(),
    title, author, genre, desc, emoji,
    status,
    pages, pagesRead,
    color: currentBookColor,
    favorite: false,
    createdAt: Date.now()
  };

  state.books.unshift(book);
  saveState();

  // Reset form
  ['bookTitle','bookAuthor','bookGenre','bookPages','bookPagesRead','bookDesc','bookEmoji']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.querySelector('input[name="bookStatus"][value="reading"]').checked = true;

  showToast(`"${title}" added to your library! 📚`);
  showPage('library');
}

/* ════════════════════════════════════════════════════════
   BOOK DETAIL PAGE
════════════════════════════════════════════════════════ */
function openBook(id) {
  const book = state.books.find(b => b.id === id);
  if (!book) return;

  showPage('book-detail');

  const progress = book.pages > 0
    ? Math.min(100, Math.round((book.pagesRead / book.pages) * 100)) : 0;

  const bookNotes = state.notes.filter(n => n.bookId === id);
  const notesHTML = bookNotes.length > 0
    ? bookNotes.map(n => `
        <div class="note-snippet-card" onclick="openNoteFromBook('${n.id}')">
          <strong>${escapeHtml(n.title || 'Untitled')}</strong><br/>
          ${escapeHtml(stripHtml(n.body).slice(0, 100))}${stripHtml(n.body).length > 100 ? '…' : ''}
          <div class="note-snippet-date">${fmtDate(n.updatedAt)}</div>
        </div>`).join('')
    : `<p style="color:var(--text3);font-size:0.875rem">No notes for this book yet.</p>`;

  const favLabel = book.favorite ? '★ Unfavorite' : '☆ Favorite';
  const favCls   = book.favorite ? 'action-btn active' : 'action-btn';
  const doneLabel = book.status === 'completed' ? '✓ Completed' : 'Mark Complete';
  const doneCls   = book.status === 'completed' ? 'action-btn active' : 'action-btn';

  document.getElementById('bookDetailContent').innerHTML = `
    <div class="book-detail-layout">
      <div>
        <div class="detail-cover" style="background:${book.color}">
          <div class="detail-cover-spine"></div>
          ${book.emoji
            ? `<span style="font-size:4rem">${book.emoji}</span>`
            : `<span style="font-size:1.1rem;font-family:var(--font-serif);font-style:italic;color:rgba(255,255,255,0.9);padding:20px;text-align:center;line-height:1.4">${escapeHtml(book.title)}</span>`}
        </div>
      </div>
      <div class="detail-info">
        <h1 class="detail-title">${escapeHtml(book.title)}</h1>
        <div class="detail-author">by ${escapeHtml(book.author)}</div>

        <div class="detail-meta-row">
          <div class="detail-meta-item">
            <div class="detail-meta-label">Status</div>
            <div class="detail-meta-value"><span class="status-badge ${book.status}">${statusLabel(book.status)}</span></div>
          </div>
          ${book.genre ? `<div class="detail-meta-item">
            <div class="detail-meta-label">Genre</div>
            <div class="detail-meta-value">${escapeHtml(book.genre)}</div>
          </div>` : ''}
          ${book.pages > 0 ? `<div class="detail-meta-item">
            <div class="detail-meta-label">Pages</div>
            <div class="detail-meta-value">${book.pagesRead} / ${book.pages}</div>
          </div>` : ''}
          <div class="detail-meta-item">
            <div class="detail-meta-label">Added</div>
            <div class="detail-meta-value">${fmtDate(book.createdAt)}</div>
          </div>
        </div>

        ${book.pages > 0 ? `
        <div class="progress-wrap">
          <div class="progress-label">
            <span>Reading Progress</span>
            <span>${progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>
        </div>` : ''}

        <div class="detail-actions">
          <button class="${doneCls}" onclick="markComplete('${book.id}')">
            ${doneLabel}
          </button>
          <button class="${favCls}" onclick="toggleFavorite('${book.id}')">
            ${favLabel}
          </button>
          <button class="action-btn" onclick="addNoteForBook('${book.id}')">
            ✍️ Add Note
          </button>
          <button class="action-btn" onclick="deleteBook('${book.id}')" style="color:#c0392b">
            🗑 Delete
          </button>
        </div>

        ${book.desc ? `<div class="detail-desc">${escapeHtml(book.desc)}</div>` : ''}

        <div class="detail-notes-title">Notes for this book</div>
        ${notesHTML}
      </div>
    </div>
  `;

  // Animate progress bar
  setTimeout(() => {
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = progress + '%';
  }, 100);
}

function markComplete(id) {
  const book = state.books.find(b => b.id === id);
  if (!book) return;
  book.status = book.status === 'completed' ? 'reading' : 'completed';
  if (book.status === 'completed') { book.pagesRead = book.pages; }
  saveState();
  openBook(id);
  showToast(book.status === 'completed' ? '🎉 Book marked as complete!' : 'Back to reading!');
}

function toggleFavorite(id) {
  const book = state.books.find(b => b.id === id);
  if (!book) return;
  book.favorite = !book.favorite;
  saveState();
  openBook(id);
  showToast(book.favorite ? '⭐ Added to favorites!' : 'Removed from favorites.');
}

function deleteBook(id) {
  if (!confirm('Delete this book from your library?')) return;
  state.books = state.books.filter(b => b.id !== id);
  saveState();
  showToast('Book deleted.');
  showPage('library');
}

/* ════════════════════════════════════════════════════════
   NOTES PAGE
════════════════════════════════════════════════════════ */
function renderNotes() {
  const list = document.getElementById('notesList');
  if (!list) return;

  if (state.notes.length === 0) {
    list.innerHTML = `<div style="padding:24px 18px;color:var(--text3);font-size:0.85rem;text-align:center">
      No notes yet.<br/>Create one with the button above.
    </div>`;
    return;
  }

  list.innerHTML = state.notes
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(n => `
      <div class="note-item ${n.id === currentNoteId ? 'active' : ''}" onclick="selectNote('${n.id}')">
        <div class="note-item-title">${escapeHtml(n.title || 'Untitled')}</div>
        <div class="note-item-preview">${escapeHtml(stripHtml(n.body).slice(0, 60)) || 'No content…'}</div>
        <div class="note-item-date">${fmtDate(n.updatedAt)}</div>
      </div>`).join('');
}

function createNote(bookId) {
  showPage('notes');
  const note = {
    id: uid(),
    title: '',
    body: '',
    bookId: bookId || null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  state.notes.unshift(note);
  saveState();
  selectNote(note.id);
  renderNotes();
}

function addNoteForBook(bookId) {
  createNote(bookId);
}

function openNoteFromBook(noteId) {
  showPage('notes');
  selectNote(noteId);
}

function selectNote(id) {
  currentNoteId = id;
  const note = state.notes.find(n => n.id === id);
  if (!note) return;

  document.querySelectorAll('.note-item').forEach(el => {
    el.classList.toggle('active', el.onclick?.toString().includes(id));
  });

  document.getElementById('editorEmpty').style.display = 'none';
  const panel = document.getElementById('editorPanel');
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.flex = '1';
  panel.style.overflow = 'hidden';

  document.getElementById('noteTitle').value = note.title || '';
  document.getElementById('noteBody').innerHTML = note.body || '';

  renderNotes();
}

function saveCurrentNote() {
  if (!currentNoteId) return;
  const note = state.notes.find(n => n.id === currentNoteId);
  if (!note) return;

  note.title = document.getElementById('noteTitle').value.trim();
  note.body  = document.getElementById('noteBody').innerHTML;
  note.updatedAt = Date.now();
  saveState();

  // Autosave indicator
  clearTimeout(noteAutosaveTimer);
  const ind = document.getElementById('autosaveIndicator');
  if (ind) { ind.textContent = 'Saving…'; }
  noteAutosaveTimer = setTimeout(() => {
    if (ind) ind.textContent = 'Saved ✓';
    renderNotes();
  }, 600);
}

function deleteCurrentNote() {
  if (!currentNoteId) return;
  if (!confirm('Delete this note?')) return;
  state.notes = state.notes.filter(n => n.id !== currentNoteId);
  currentNoteId = null;
  saveState();
  document.getElementById('editorEmpty').style.display = '';
  document.getElementById('editorPanel').style.display = 'none';
  renderNotes();
  showToast('Note deleted.');
}

function execFmt(cmd, val) {
  document.getElementById('noteBody').focus();
  document.execCommand(cmd, false, val || null);
}

/* ════════════════════════════════════════════════════════
   DOCUMENTS PAGE
════════════════════════════════════════════════════════ */
function renderDocuments() {
  const grid  = document.getElementById('docsGrid');
  const empty = document.getElementById('docsEmpty');
  if (!grid) return;

  if (state.documents.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = state.documents
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(doc => `
      <div class="doc-card" onclick="openDocument('${doc.id}')">
        <button class="doc-card-del" onclick="event.stopPropagation();deleteDocument('${doc.id}')">🗑</button>
        <div class="doc-card-icon">📄</div>
        <div class="doc-card-title">${escapeHtml(doc.title || 'Untitled Document')}</div>
        <div class="doc-card-meta">
          ${doc.body ? (stripHtml(doc.body).length) + ' chars · ' : ''}
          ${fmtDate(doc.updatedAt)}
        </div>
      </div>`).join('');
}

function createDocument() {
  const doc = {
    id: uid(),
    title: '',
    body: '',
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  state.documents.unshift(doc);
  saveState();
  openDocument(doc.id);
}

function openDocument(id) {
  currentDocId = id;
  const doc = state.documents.find(d => d.id === id);
  if (!doc) return;

  document.getElementById('docsListView').style.display  = 'none';
  document.getElementById('docsEditorView').style.display = 'block';

  document.getElementById('docTitle').value = doc.title || '';
  document.getElementById('docBody').innerHTML = doc.body || '';
  document.getElementById('docMeta').textContent =
    `Last updated: ${fmtDate(doc.updatedAt)}`;
}

function closeDocEditor() {
  document.getElementById('docsListView').style.display   = 'block';
  document.getElementById('docsEditorView').style.display = 'none';
  currentDocId = null;
  renderDocuments();
}

function saveCurrentDoc() {
  if (!currentDocId) return;
  const doc = state.documents.find(d => d.id === currentDocId);
  if (!doc) return;

  doc.title = document.getElementById('docTitle').value.trim();
  doc.body  = document.getElementById('docBody').innerHTML;
  doc.updatedAt = Date.now();
  saveState();

  clearTimeout(docAutosaveTimer);
  const ind = document.getElementById('docAutosave');
  if (ind) ind.textContent = 'Saving…';
  docAutosaveTimer = setTimeout(() => {
    if (ind) ind.textContent = 'Saved ✓';
    document.getElementById('docMeta').textContent = `Last updated: ${fmtDate(doc.updatedAt)}`;
  }, 600);
}

function deleteDocument(id) {
  if (!confirm('Delete this document?')) return;
  state.documents = state.documents.filter(d => d.id !== id);
  saveState();
  renderDocuments();
  showToast('Document deleted.');
}

function execDocFmt(cmd, val) {
  document.getElementById('docBody').focus();
  document.execCommand(cmd, false, val || null);
}

/* ════════════════════════════════════════════════════════
   FAVORITES PAGE
════════════════════════════════════════════════════════ */
function renderFavorites() {
  const grid  = document.getElementById('favGrid');
  const empty = document.getElementById('favEmpty');
  if (!grid) return;

  const favBooks = state.books.filter(b => b.favorite);
  if (favBooks.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = favBooks.map(bookCardHTML).join('');
}

/* ════════════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════════════ */
function applyDarkMode(dark) {
  document.body.classList.toggle('dark-mode', dark);
  const label = document.getElementById('darkLabel');
  const icon  = document.getElementById('darkIcon');
  if (label) label.textContent = dark ? 'Light Mode' : 'Dark Mode';
  if (icon) {
    icon.innerHTML = dark
      ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
      : '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  }
}

function toggleDark() {
  state.settings.darkMode = !state.settings.darkMode;
  applyDarkMode(state.settings.darkMode);
  saveState();
}

/* ════════════════════════════════════════════════════════
   MOBILE SIDEBAR
════════════════════════════════════════════════════════ */
function closeMobileSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
}

/* ════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════ */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════ */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html || '';
  return div.textContent || '';
}

/* ════════════════════════════════════════════════════════
   SEED DATA (first visit)
════════════════════════════════════════════════════════ */
function seedData() {
  if (state.books.length > 0) return;

  const books = [
    { title:'The Alchemist', author:'Paulo Coelho', genre:'Fiction, Adventure', status:'reading', pages:208, pagesRead:163, color:'#c4854a', emoji:'🌅', desc:'A beautiful story about following your dreams and listening to your heart.', favorite:true },
    { title:'Atomic Habits', author:'James Clear', genre:'Self-Help', status:'completed', pages:320, pagesRead:320, color:'#4a8cb8', emoji:'⚡', desc:'Tiny changes, remarkable results.', favorite:false },
    { title:'It Ends With Us', author:'Colleen Hoover', genre:'Romance', status:'reading', pages:385, pagesRead:200, color:'#b84a7a', emoji:'🌸', desc:'A powerful and emotional story.', favorite:false },
    { title:'Verity', author:'Colleen Hoover', genre:'Thriller', status:'completed', pages:336, pagesRead:336, color:'#2d6b4a', emoji:'🕯️', desc:'A gripping psychological thriller.', favorite:true },
    { title:'Daisy Jones & The Six', author:'Taylor Jenkins Reid', genre:'Fiction', status:'reading', pages:368, pagesRead:120, color:'#7a4a8c', emoji:'🎸', desc:'A fictional oral history of a legendary rock band.', favorite:false },
    { title:'Rich Dad Poor Dad', author:'Robert T. Kiyosaki', genre:'Finance', status:'wishlist', pages:207, pagesRead:0, color:'#8c7a2a', emoji:'💰', desc:'What the rich teach their kids about money.', favorite:false },
  ];

  state.books = books.map(b => ({
    ...b,
    id: uid(),
    createdAt: Date.now() - Math.random() * 1e9
  }));

  const notes = [
    { title:'Morning Reading Reflection', body:"<p>There's something magical about starting the day with a few pages of a book. It sets the tone for clarity, peace, and inspiration.</p><p>Today I read a beautiful line that reminded me to enjoy the little things in life.</p>" },
    { title:'Books That Changed My Life', body:"<ul><li>The Alchemist — Paulo Coelho</li><li>Atomic Habits — James Clear</li><li>The Power of Now — Eckhart Tolle</li></ul>" },
    { title:'Favorite Quotes', body:"<p><em>\"When you want something, all the universe conspires in helping you to achieve it.\"</em> — Paulo Coelho</p>" },
  ];

  state.notes = notes.map(n => ({
    ...n,
    id: uid(),
    bookId: null,
    createdAt: Date.now() - Math.random() * 1e8,
    updatedAt: Date.now() - Math.random() * 1e8
  }));

  const docs = [
    { title:'Chapter Summaries', body:'<h2>The Alchemist — Chapter Summaries</h2><p>Part One: Santiago, a young shepherd, decides to pursue a recurring dream...</p>' },
    { title:'Reading Journal 2024', body:'<p>My reading goals and reflections for 2024.</p><ul><li>Read 24 books this year</li><li>One book per genre</li></ul>' },
  ];

  state.documents = docs.map(d => ({
    ...d,
    id: uid(),
    createdAt: Date.now() - Math.random() * 1e8,
    updatedAt: Date.now() - Math.random() * 1e8
  }));

  saveState();
}

/* ════════════════════════════════════════════════════════
   SCROLL FADE-IN ANIMATIONS
════════════════════════════════════════════════════════ */
function initScrollObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stat-card, .book-card, .doc-card').forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });
}

/* ════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  seedData();
  applyDarkMode(state.settings.darkMode);

  // Sidebar nav buttons
  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => showPage(btn.dataset.page));
  });

  // Dark mode toggles
  document.getElementById('darkToggle')?.addEventListener('click', toggleDark);
  document.getElementById('mobileDark')?.addEventListener('click', toggleDark);

  // Mobile sidebar
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('active');
  });

  document.getElementById('sidebarOverlay')?.addEventListener('click', closeMobileSidebar);

  // Start on home page
  showPage('home');

  // Observe for scroll animations after a brief delay
  setTimeout(initScrollObserver, 300);
});
