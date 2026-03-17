/* ═══════════════════════════════════════
   WhatsApp Clone — app.js
   ═══════════════════════════════════════ */

/* ── DOM References ── */
const sidebar     = document.getElementById('sidebar');
const chatWindow  = document.getElementById('chatWindow');
const backBtn     = document.getElementById('backBtn');
const msgList     = document.getElementById('msgList');
const msgInput    = document.getElementById('msgInput');
const sendBtn     = document.getElementById('sendBtn');
onResize();
const searchInput = document.getElementById('searchInput');
const chatItems   = document.querySelectorAll('.wa-chat-item');
const typingRow   = document.getElementById('typingRow');
const hdrName     = document.getElementById('hdrName');
const hdrAvatar   = document.getElementById('hdrAvatar');
const hdrDot      = document.getElementById('hdrDot');
const hdrStatus   = document.getElementById('hdrStatus');

/* ── Helpers ── */
const isMobile = () => window.innerWidth < 600;

function getTime() {
  const now = new Date();
  return String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
onResize();
}

function scrollToBottom() {
  msgList.scrollTop = msgList.scrollHeight;
}

function escapeHTML(str) {
  return str
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Open Chat ── */
function openChat(item) {
  /* Active state */
  chatItems.forEach(i => i.classList.remove('active'));
  item.classList.add('active');

  /* Update header */
  const { name, initial, color, status } = item.dataset;
  hdrName.textContent        = name;
  hdrAvatar.textContent      = initial;
  hdrAvatar.style.background = color;
  hdrDot.style.display       = status === 'online' ? 'block' : 'none';
  hdrStatus.textContent      = status === 'online' ? 'online' : 'last seen recently';
  hdrStatus.style.color      = status === 'online' ? '#00a884' : '#8696a0';

  /* Remove unread badge */
  item.querySelector('.wa-unread')?.remove();
  item.querySelector('.wa-chat-time')?.classList.remove('new');

  /* Mobile: slide to chat */
  if (isMobile()) {
    sidebar.classList.add('hidden');
    chatWindow.classList.add('show');
  }

  scrollToBottom();
}

/* ── Back (mobile) ── */
function goBack() {
  sidebar.classList.remove('hidden');
  chatWindow.classList.remove('show');
}

/* ── Send Message ── */
function sendMessage() {
  const text = msgInput.value.trim();
  if (!text) return;

  const row = document.createElement('div');
  row.className = 'wa-bubble-row sent';
  row.innerHTML = `
    <div class="wa-bubble sent">
      <div class="wa-bubble-text">${escapeHTML(text)}</div>
      <div class="wa-bubble-meta">
        <span class="wa-bubble-time">${getTime()}</span>
        <span class="wa-tick">✓✓</span>
      </div>
    </div>`;
  msgList.insertBefore(row, typingRow);

  /* Update sidebar preview */
  const active = document.querySelector('.wa-chat-item.active');
  if (active) {
    const prev  = active.querySelector('.wa-chat-preview');
    const tEl   = active.querySelector('.wa-chat-time');
    if (prev) prev.textContent = '✓✓ ' + text;
    if (tEl)  tEl.textContent  = getTime();
  }

  msgInput.value = '';
  msgInput.style.height = 'auto';
  scrollToBottom();
}

/* ── Auto-resize textarea ── */
function autoResize() {
  msgInput.style.height = 'auto';
  msgInput.style.height = Math.min(msgInput.scrollHeight, 120) + 'px';
}

/* ── Search / Filter ── */
function filterChats(query) {
  const q = query.toLowerCase().trim();
  chatItems.forEach(item => {
    const name = item.dataset.name.toLowerCase();
    item.classList.toggle('hidden', q !== '' && !name.includes(q));
  });
}

/* ── Resize: restore layout on tablet/desktop ── */
function onResize() {
  if (!isMobile()) {
    sidebar.classList.remove('hidden');
    chatWindow.classList.remove('show');
  }
}

/* ════════════════════════
   EVENT LISTENERS
════════════════════════ */
chatItems.forEach(item => item.addEventListener('click', () => openChat(item)));
backBtn.addEventListener('click', goBack);
sendBtn.addEventListener('click', sendMessage);

msgInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});
msgInput.addEventListener('input', autoResize);
searchInput.addEventListener('input', () => filterChats(searchInput.value));
window.addEventListener('resize', onResize);

/* ── Init ── */
scrollToBottom();
// On tablet/desktop ensure correct initial layout
onResize();
