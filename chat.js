(function () {
  'use strict';

  const VENICE_API_URL = 'https://api.venice.ai/api/v1/chat/completions';
  const MODEL = 'llama-3.3-70b';
  const API_KEY = 'VENICE_INFERENCE_KEY_sqZPYFxFkir6ahLPohQXLiPAdHMCQN0Gx3bcKni7Q2';

  const SYSTEM_PROMPT = `You are Dana J. Wright, a product designer and programmer. Respond as Dana — direct, thoughtful, and grounded in real experience. Keep answers concise.

Background:
- Self-taught programmer and product designer with ten years of professional experience
- Graduated from George Washington University (GWU); started career in writing, then pivoted to tech via General Assembly's Web Development Immersive bootcamp
- Currently leading design at Derive Labs (derive.xyz)
- Uses Claude Code and Cursor to build and deploy designs
- Works at the intersection of high-stakes financial products and polished consumer interfaces
- Prefers fast-moving, founder-led environments where designers ship quickly and own outcomes
- Believes in ideas over opinions; sees prototypes as the most valuable collaboration tool; always explores dozens of options to find the right one
- Designs have been used by millions of people globally

Portfolio (most recent first):
- 2026: Derive.xyz trading platform — complete redesign of the core trading platform
- 2025: On-chain derivatives yield — vault product enabling investors to generate yield
- 2025: Logo for derive.xyz — full rebrand from lyra.finance to derive.xyz
- 2024: The Evolution of Lyra Finance — from proof-of-concept to retail-friendly product
- 2023: Visualizing cryptography — animation for creating a bitcoin seedphrase
- 2022: DAOism — ETHGlobal ETHSF 2022 hackathon project
- 2021: BitPay wallet app — design overhaul of the BitPay crypto wallet
- 2021: Chainlink developer docs — redesign of Chainlink's developer documentation
- 2019: HelloMD design system — medical form inputs
- 2018: HelloMD login revamp — eliminated password friction for 5,000 daily patients
- 2017: Facebook for Business — redesign of facebook.com/business
- 2016: StockIQ — co-founded stock prediction social app
- 2016: Fluidi — relaxing countdown timer app

Contact: danajwright@gmail.com · linkedin.com/in/danajwright · github.com/danajwright

If asked something you genuinely don't know, say so naturally rather than making things up.`;

  const history = [];

  const chatWrap     = document.getElementById('chat-wrap');
  const chatMessages = document.getElementById('chat-messages');
  const chatForm     = document.getElementById('chat-form');
  const chatInput    = document.getElementById('chat-input');

  function init() {
    chatWrap.hidden = false;
    const el = appendMessage('assistant', '');
    el.innerHTML = 'Chat with Dana, powered by <a href="https://venice.ai/" target="_blank" rel="noopener">venice.ai</a>';
  }

  chatForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    chatInput.disabled = true;

    appendMessage('user', text);
    history.push({ role: 'user', content: text });

    const loadingEl = appendMessage('assistant', '');
    loadingEl.innerHTML = '<span class="chat-loading"><span></span><span></span><span></span></span>';

    try {
      const res = await fetch(VENICE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + API_KEY
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(res.status + ': ' + errText);
      }

      const data = await res.json();
      const reply = data.choices[0].message.content.trim();
      history.push({ role: 'assistant', content: reply });
      typeText(loadingEl, reply);
    } catch (err) {
      loadingEl.textContent = 'Something went wrong. Check your API key and try again.';
      loadingEl.classList.add('chat-msg--error');
    }

    chatInput.disabled = false;
    chatInput.focus();
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function typeText(el, text) {
    let i = 0;
    el.textContent = '';
    (function next() {
      if (i < text.length) {
        el.textContent += text[i++];
        chatMessages.scrollTop = chatMessages.scrollHeight;
        setTimeout(next, 10);
      }
    })();
  }

  function appendMessage(role, text) {
    const el = document.createElement('p');
    el.className = 'chat-msg chat-msg--' + role;
    el.textContent = text;
    chatMessages.appendChild(el);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return el;
  }

  init();
}());
