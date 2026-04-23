/* =============================================
   Duanne Harold S. Alava — Portfolio Scripts
   ============================================= */

// ── Hamburger Menu ──
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  const open = mainNav.classList.toggle('nav-mobile-open');
  hamburger.setAttribute('aria-expanded', open);
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('nav-mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside the nav
document.addEventListener('click', (e) => {
  if (!mainNav.contains(e.target)) {
    mainNav.classList.remove('nav-mobile-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// ── Scroll Reveal ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// ── Chatbot Toggle ──
const trigger  = document.getElementById('chatbot-trigger');
const panel    = document.getElementById('chatbot-panel');
const closeBtn = document.getElementById('chatbot-close');

trigger.addEventListener('click', () => {
  const open = panel.classList.toggle('open');
  trigger.setAttribute('aria-expanded', open);
  if (open) document.getElementById('chatbot-input').focus();
});

closeBtn.addEventListener('click', () => {
  panel.classList.remove('open');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.focus();
});

// ── Chat history (kept in memory; no API key here) ──
let chatHistory = [];

// ── Send message on button click ──
async function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendMessage(text, 'user');
  document.getElementById('quick-replies').style.display = 'none';
  await getBotResponse(text);
}

// ── Send quick-reply preset ──
function sendQuick(text) {
  appendMessage(text, 'user');
  document.getElementById('quick-replies').style.display = 'none';
  getBotResponse(text);
}

// ── Append message bubble to chat ──
function appendMessage(text, role) {
  const msgs = document.getElementById('chatbot-messages');
  const div  = document.createElement('div');
  div.className = `msg msg-${role === 'user' ? 'user' : 'bot'}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
}

// ── Show / remove typing indicator ──
function showTyping() {
  const msgs = document.getElementById('chatbot-messages');
  const div  = document.createElement('div');
  div.className   = 'msg msg-bot msg-typing';
  div.id          = 'typing-indicator';
  div.innerHTML   = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  msgs.appendChild(div);
  msgs.scrollTop  = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

// ── Fetch bot response — calls our secure /api/chat backend ──
async function getBotResponse(userText) {
  showTyping();

  // Build the messages array for this request (history minus the message we just pushed)
  const messages = chatHistory
    .slice(0, -1)                             // exclude the user msg we just appended
    .map(m => ({ role: m.role, content: m.content }));
  messages.push({ role: 'user', content: userText });

  try {
    // ✅ POST to our own Vercel serverless function — no API key in the browser
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    removeTyping();

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Chat API error:', err);
      appendMessage("Sorry, something went wrong on my end. Please try again!", 'bot');
      return;
    }

    const data = await response.json();

    // Our /api/chat backend returns: { reply: "..." }
    const replyText = data.reply ?? "Sorry, I couldn't process that. Try asking something else!";

    appendMessage(replyText, 'bot');

  } catch (err) {
    removeTyping();
    console.error('Network error:', err);
    appendMessage("Hmm, I'm having trouble connecting. Please try again in a moment!", 'bot');
  }
}

// ── Contact Form Submit ──
function handleFormSubmit() {
  const name  = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const msg   = document.getElementById('contact-msg').value.trim();
  if (!name || !email || !msg) {
    alert('Please fill in your name, email, and message.');
    return;
  }
  alert(`Thanks, ${name}! Your message has been received. Duanne will get back to you soon.`);
}

// ── Active nav link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.opacity = a.getAttribute('href') === `#${current}` ? '1' : '0.7';
  });
}, { passive: true });
