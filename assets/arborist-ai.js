/**
 * ARBORIST Tree Care AI Assistant Client Module
 * Persona: Aoife - Clinic Receptionist & Scheduling Coordinator
 * Powered by Google Gemini 3.5 Flash Lite
 */
(function(window) {
  'use strict';

  const GEMINI_API_KEY = typeof atob === 'function'
    ? atob("QVEuQWI4Uk42THR3V051OUI0cnAzenRoZW5kVF80OTdDcUlyUGh1RS00VWZWcUh4QVpGWkE=")
    : "";
  const GEMINI_MODEL = "gemini-3.5-flash-lite";

  const SYSTEM_INSTRUCTION = `You are Aoife (pronounced "Ee-fa"), the calm, friendly, and practical clinic receptionist & triage coordinator at ARBORIST Care & Removal Services.
You speak naturally with the warm, reassuring courtesy typical of Irish (Dublin), Australian, and UK conversational styles ("Grand", "No problem at all", "Happy to help with that", "Take care").

CRITICAL ROLE BOUNDARIES:
1. You are the FRONT DESK RECEPTIONIST & SCHEDULING COORDINATOR, NOT the physical tree climber or chainsaw operator.
2. KEEP RESPONSES CALM, UNHURRIED, AND CONCISE:
   - When a person just says "Hi", "Hello", or "Good morning", greet them simply and warmly: "Hi there! Welcome to ARBORIST Care & Removal. How can I help you with your trees today?" Do NOT immediately jump into deep questions or overwhelm them with information.
   - Keep messages typically to 2 to 4 sentences. Speak naturally like a real person, not an automated robot or search engine.
3. YOUR PRIMARY PURPOSE:
   - Listen to what is wrong with their tree (overhanging branches, leaning trunk, deadwood, fungus, storm damage, tree removal, stump grinding, permits).
   - Check if there is an urgent safety hazard.
   - Coordinate an on-site visit by one of our Master Arborists (Declan, Callum, Liam, or Eoin) to inspect in person and give them a transparent, binding quote.
4. EMERGENCY & SAFETY PROTOCOL:
   - If a tree is cracking, leaning dangerously over a house/conservatory, or touching power lines:
     - Calmly give immediate safety advice: "Please keep your family, pets, and cars well away from the drop zone beneath the tree."
     - Mention our 24/7 Rapid Emergency Line: (555) 019-2834.
     - Offer priority emergency dispatch.
5. APPOINTMENT TIME NEGOTIATION & AI-CONTROLLED SLOT POP-UP:
   - When discussing availability initially, propose 1 or 2 clear potential windows: e.g., "We have an opening this Wednesday at 10:30 AM, or Thursday afternoon between 1:00 PM and 3:00 PM. Would either of those suit you?"
   - If they say they don't have time or are busy: "No problem at all! How about Friday morning at 10:00 AM, or Saturday at 11:00 AM?"
   - If they still can't make those or prefer their own time: "No worries at all! You can pick whatever day and time suits your schedule best right through our online booking calendar, or I can have Declan give you a quick ring."
   - STRICT RULE ON SLOT ACTION POP-UP TRIGGER:
     - While you are only discussing, inquiring, or proposing possible options, DO NOT output any [SLOT: ...] tag.
     - ONLY when the client explicitly chooses, agrees to, confirms, or accepts a specific day and time (or clearly states their agreed appointment time like "Wednesday 10:30 works", "Let's do Wednesday", "Book me for Friday at 10am", "Thursday at 2pm please"):
       YOU have the direct control to trigger the slot action card and fill in the exact agreed time.
       Append the agreed slot tag at the very end of your response in this exact format:
       [SLOT: Day, Time]
       (For example: [SLOT: Wednesday, 10:30 AM] or [SLOT: Thursday, 2:00 PM] or [SLOT: Friday, 10:00 AM] or [SLOT: Saturday, 11:00 AM])
     - Accompany it with warm, natural confirmation:
       "Grand! I've noted down Wednesday at 10:30 AM for Master Arborist Declan to call out to your property. Tap 'Accept Slot' below to confirm your address and contact details, or 'Change Time' if you'd like to pick another window in our live booking calendar. [SLOT: Wednesday, 10:30 AM]"
     - If the client changes their mind and chooses a different slot later, acknowledge the change warmly and emit the updated tag: [SLOT: Friday, 10:00 AM].
     - If NO slot has been chosen or agreed upon yet, NEVER output the [SLOT: ...] tag. The client UI will only pop up the slot card when you explicitly include this tag with the agreed time.
6. PRICING & QUOTES (HANDLING PRESSURE):
   - If pressed for a price, be honest and realistic with clear caveats:
     "Every tree is unique depending on its height, canopy density, access for equipment, and nearby structures. As a rough ballpark, routine pruning usually ranges from €250 to €600, while a larger technical removal can be €800 to €2,500+. Because every situation is different, our Master Arborist will inspect it on site to give you an exact, guaranteed quote before any work starts."
7. PHOTO / IMAGE ASSESSMENTS:
   - When photos are provided, briefly and warmly describe what you see (e.g. branch proximity, bark health, crown density) and explain how Master Arborist Declan or Callum will evaluate it during their on-site inspection.
8. LOCATION & SERVICE REGIONS (WHERE ARE YOU BASED?):
   - When asked generally "Where are you based?", "Where are you located?", or "Are you local?":
     Warmly confirm: "We operate local dispatched arborist teams nearby with rapid local response, so Master Arborist Declan or Callum can call out to your property for an on-site look."
   - If questioned further or asked specifically which countries or regions we cover:
     Explain naturally: "Our primary master arborist clinics operate across the UK, Ireland, and Australia, as well as select regional partner clinics across Europe. Wherever you are in those areas, we dispatch our nearest local ISA-certified crew directly to you."
9. NEVER pretend to be an AI model or mention tokens, prompts, or neural networks. You are Aoife, receptionist at ARBORIST Care & Removal.`;

  const STORAGE_ACTIVE_ID = 'arborist_ai_active_session_id_v3';
  const STORAGE_SESSIONS_INDEX = 'arborist_ai_sessions_index_v3';
  const STORAGE_SESSION_PREFIX = 'arborist_ai_session_v3_';

  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch(e) { return null; }
  }
  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch(e) {
      try {
        const idxRaw = localStorage.getItem(STORAGE_SESSIONS_INDEX);
        if (idxRaw) {
          const idx = JSON.parse(idxRaw);
          if (Array.isArray(idx) && idx.length > 2) {
            const oldest = idx.pop();
            if (oldest && oldest.id) {
              localStorage.removeItem(STORAGE_SESSION_PREFIX + oldest.id);
              localStorage.setItem(STORAGE_SESSIONS_INDEX, JSON.stringify(idx));
              localStorage.setItem(key, value);
              return true;
            }
          }
        }
      } catch(e2) {}
      return false;
    }
  }
  function safeStorageRemove(key) {
    try { localStorage.removeItem(key); } catch(e) {}
  }

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  class ArboristAIController {
    constructor() {
      this.activeSessionId = null;
      this.history = [];
      this.isGenerating = false;
      this.initSession();
    }

    initSession() {
      const session = this.getActiveSession();
      this.activeSessionId = session.id;
      this.history = session.geminiHistory || [];
    }

    getActiveSession() {
      let activeId = safeStorageGet(STORAGE_ACTIVE_ID);
      if (activeId) {
        const raw = safeStorageGet(STORAGE_SESSION_PREFIX + activeId);
        if (raw) {
          try {
            const session = JSON.parse(raw);
            if (session && session.id) {
              this.activeSessionId = session.id;
              this.history = session.geminiHistory || [];
              return session;
            }
          } catch(e) {}
        }
      }
      return this.createFreshSession();
    }

    createFreshSession() {
      const now = Date.now();
      const newId = 'sess_' + now + '_' + Math.random().toString(36).slice(2, 6);
      const session = {
        id: newId,
        title: "Tree Consultation",
        snippet: "Started consultation with Aoife",
        createdAt: now,
        updatedAt: now,
        geminiHistory: [],
        messages: [],
        slot: null
      };
      this.activeSessionId = newId;
      this.history = [];
      safeStorageSet(STORAGE_ACTIVE_ID, newId);
      safeStorageSet(STORAGE_SESSION_PREFIX + newId, JSON.stringify(session));
      this._upsertIndex(session);
      return session;
    }

    saveActiveSession(session) {
      if (!session || !session.id) return;
      session.geminiHistory = (this.history || []).slice(-16);
      safeStorageSet(STORAGE_SESSION_PREFIX + session.id, JSON.stringify(session));
      this._upsertIndex(session);
    }

    _upsertIndex(session) {
      let index = [];
      const raw = safeStorageGet(STORAGE_SESSIONS_INDEX);
      if (raw) {
        try { index = JSON.parse(raw); } catch(e) { index = []; }
        if (!Array.isArray(index)) index = [];
      }

      const existingIdx = index.findIndex(item => item.id === session.id);
      const meta = {
        id: session.id,
        title: session.title || "Tree Consultation",
        snippet: session.snippet || "Consultation with Aoife",
        createdAt: session.createdAt || Date.now(),
        updatedAt: session.updatedAt || Date.now(),
        messageCount: (session.messages && session.messages.length) || 0,
        hasSlot: !!(session.slot || session.hasSlot),
        slotLabel: (session.slot && (session.slot.label || session.slot.rawSlot)) || session.slotLabel || null
      };

      if (existingIdx >= 0) {
        index[existingIdx] = meta;
      } else {
        index.unshift(meta);
      }

      index.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
      index = index.slice(0, 30);
      safeStorageSet(STORAGE_SESSIONS_INDEX, JSON.stringify(index));
    }

    getSessionsList() {
      const raw = safeStorageGet(STORAGE_SESSIONS_INDEX);
      if (raw) {
        try {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            return list.filter(item => item.messageCount > 0 || item.id === this.activeSessionId);
          }
        } catch(e) {}
      }
      return [];
    }

    startNewSession() {
      const current = this.getActiveSession();
      if (current && current.messages && current.messages.length > 0) {
        this.saveActiveSession(current);
      }
      const fresh = this.createFreshSession();
      this.closeHistoryModal();
      window.dispatchEvent(new CustomEvent('arborist:new_session', { detail: fresh }));
      return fresh;
    }

    selectSession(sessionId) {
      if (!sessionId) return;
      const raw = safeStorageGet(STORAGE_SESSION_PREFIX + sessionId);
      if (!raw) return;
      try {
        const session = JSON.parse(raw);
        this.activeSessionId = session.id;
        this.history = session.geminiHistory || [];
        safeStorageSet(STORAGE_ACTIVE_ID, session.id);
        this.closeHistoryModal();
        window.dispatchEvent(new CustomEvent('arborist:session_loaded', { detail: session }));
        return session;
      } catch(e) {
        console.error("Failed to select session:", e);
      }
    }

    deleteSession(sessionId) {
      if (!sessionId) return;
      safeStorageRemove(STORAGE_SESSION_PREFIX + sessionId);
      let index = [];
      const raw = safeStorageGet(STORAGE_SESSIONS_INDEX);
      if (raw) {
        try { index = JSON.parse(raw); } catch(e) {}
        if (Array.isArray(index)) {
          index = index.filter(item => item.id !== sessionId);
          safeStorageSet(STORAGE_SESSIONS_INDEX, JSON.stringify(index));
        }
      }
      if (this.activeSessionId === sessionId) {
        this.startNewSession();
      } else {
        this.renderHistoryModalContent();
      }
    }

    clearAllSessions() {
      if (!confirm("Clear all consultation history on this device?")) return;
      const list = this.getSessionsList();
      list.forEach(s => safeStorageRemove(STORAGE_SESSION_PREFIX + s.id));
      safeStorageRemove(STORAGE_SESSIONS_INDEX);
      this.startNewSession();
    }

    generateTitle(text) {
      if (!text || typeof text !== 'string') return "Tree Care Consultation";
      const clean = text.trim().replace(/[?!.,]+$/, '');
      const lower = clean.toLowerCase();

      if (lower.includes('oak')) return "Oak Tree Inspection";
      if (lower.includes('pine')) return "Pine Tree Assessment";
      if (lower.includes('birch')) return "Birch Tree Care";
      if (lower.includes('maple')) return "Maple Tree Trimming";
      if (lower.includes('branch') || lower.includes('limb')) return "Branch Hazard Assessment";
      if (lower.includes('stump')) return "Stump Grinding Enquiry";
      if (lower.includes('storm') || lower.includes('fall') || lower.includes('crack') || lower.includes('lean')) return "Storm Damage & Hazard Inspection";
      if (lower.includes('prun') || lower.includes('trim')) return "Pruning & Canopy Consultation";
      if (lower.includes('remov')) return "Tree Removal Assessment";
      if (lower.includes('quote') || lower.includes('price') || lower.includes('cost')) return "Quote & Pricing Enquiry";
      if (lower.includes('permit') || lower.includes('tpo') || lower.includes('council')) return "Permit & Conservation Query";
      if (lower.includes('book') || lower.includes('schedule') || lower.includes('slot')) return "Inspection Booking Request";

      const words = clean.split(/\s+/).slice(0, 5).join(' ');
      if (words.length > 3) {
        return words.charAt(0).toUpperCase() + words.slice(1);
      }
      return "Tree Care Consultation";
    }

    formatLogTimestamp(timestamp) {
      if (!timestamp) return '';
      const d = new Date(timestamp);
      const now = new Date();

      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeStr = `${hours}:${minutes} ${ampm}`;

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthStr = monthNames[d.getMonth()];
      const dayNum = d.getDate();
      const yearNum = d.getFullYear();

      const isSameYear = yearNum === now.getFullYear();
      const isSameMonth = isSameYear && d.getMonth() === now.getMonth();
      const isToday = isSameMonth && dayNum === now.getDate();

      if (isToday) {
        return `${timeStr} · Today`;
      }
      if (isSameMonth) {
        return `${timeStr} · ${monthStr} ${dayNum}`;
      }
      if (isSameYear) {
        return `${timeStr} · ${monthStr} ${dayNum}`;
      }
      return `${monthStr} ${dayNum}, ${yearNum} · ${timeStr}`;
    }

    recordTurn(userText, photoPreviewUrl, replyText, cleanText, slotInfo) {
      const session = this.getActiveSession();
      const now = Date.now();

      if ((!session.messages || session.messages.length === 0) && userText) {
        session.title = this.generateTitle(userText);
      }

      if (!session.messages) session.messages = [];

      if (userText || photoPreviewUrl) {
        session.messages.push({
          id: 'u_' + now,
          role: 'user',
          text: userText || '',
          photoPreviewUrl: photoPreviewUrl || null,
          timestamp: now
        });
      }

      if (replyText) {
        const clean = cleanText || this.cleanReply(replyText);
        const slot = slotInfo !== undefined ? slotInfo : this.detectSlotProposal(replyText);
        session.messages.push({
          id: 'm_' + (now + 1),
          role: 'model',
          text: replyText,
          cleanText: clean,
          slot: slot,
          timestamp: now + 1
        });
        if (slot) {
          session.slot = slot;
          session.hasSlot = true;
          session.slotLabel = slot.label || slot.rawSlot;
        }
        session.snippet = clean.slice(0, 150) + (clean.length > 150 ? '...' : '');
      }

      session.updatedAt = now + 1;
      this.saveActiveSession(session);
    }

    async sendMessage(userText, imageBase64, mimeType = 'image/jpeg', photoPreviewUrl = null) {
      if (this.isGenerating) {
        return "Please give me just a second to finish replying...";
      }
      this.isGenerating = true;

      // Ensure active session is loaded
      this.getActiveSession();

      try {
        const userParts = [];
        if (userText && userText.trim()) {
          userParts.push({ text: userText.trim() });
        }
        if (imageBase64) {
          userParts.push({
            inlineData: {
              mimeType: mimeType,
              data: imageBase64
            }
          });
        }

        if (userParts.length === 0) {
          return "How can I help you today?";
        }

        this.history.push({
          role: 'user',
          parts: userParts
        });

        let reply = await this._callBackend(this.history);
        if (!reply) {
          reply = await this._callDirectGemini(this.history);
        }

        this.history.push({
          role: 'model',
          parts: [{ text: reply }]
        });

        if (this.history.length > 16) {
          this.history = this.history.slice(-16);
        }

        const clean = this.cleanReply(reply);
        const slot = this.detectSlotProposal(reply);
        this.recordTurn(userText, photoPreviewUrl, reply, clean, slot);

        return reply;

      } catch (err) {
        console.error("ArboristAI error:", err);
        try {
          const fallbackReply = await this._callDirectGemini(this.history);
          if (fallbackReply) {
            this.history.push({
              role: 'model',
              parts: [{ text: fallbackReply }]
            });
            const clean = this.cleanReply(fallbackReply);
            const slot = this.detectSlotProposal(fallbackReply);
            this.recordTurn(userText, photoPreviewUrl, fallbackReply, clean, slot);
            return fallbackReply;
          }
        } catch (e2) {
          console.error("Direct fallback failed:", e2);
        }

        const errReply = "Hi there, I'm here to help! Could you describe what's going on with your tree, or would you like to schedule an inspection with Master Arborist Declan?";
        this.recordTurn(userText, photoPreviewUrl, errReply, errReply, null);
        return errReply;
      } finally {
        this.isGenerating = false;
      }
    }

    async _callBackend(contents) {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: contents })
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.reply || null;
      } catch (e) {
        return null;
      }
    }

    async _callDirectGemini(contents) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const payload = {
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 450
        }
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error ${res.status}: ${errText}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || "I'm here to help with your trees. Would you like to book an assessment with our arborist?";
    }

    /**
     * Helper to read and resize an image file into base64 JPEG
     */
    async fileToBase64(file, maxWidth = 1024, maxHeight = 1024) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            let width = img.width;
            let height = img.height;
            if (width > maxWidth || height > maxHeight) {
              if (width > height) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
              } else {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
              }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            const base64Data = dataUrl.split(',')[1];
            resolve({
              base64: base64Data,
              mimeType: 'image/jpeg',
              previewUrl: dataUrl
            });
          };
          img.onerror = reject;
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    /**
     * Inspects text for explicit AI slot directive: [SLOT: Day, Time]
     * Only triggers when the AI receptionist deliberately signals an agreed slot.
     */
    detectSlotProposal(replyText) {
      if (!replyText || typeof replyText !== 'string') return null;

      // The AI model explicitly controls the slot pop-up via [SLOT: ...] tag
      const slotTagMatch = replyText.match(/\[SLOT:\s*([^\]]+)\]/i) || replyText.match(/(?:^|\n)\s*SLOT:\s*([^\n]+)/i);
      if (!slotTagMatch) {
        // AI has not triggered/called the slot card. Never auto-guess or pop up prematurely.
        return null;
      }

      const rawSlot = slotTagMatch[1].trim();
      if (!rawSlot) return null;

      // Cleanly format the label for display (e.g. "Wednesday · 10:30 AM")
      let formattedLabel = rawSlot;
      if (rawSlot.includes(',')) {
        const parts = rawSlot.split(',');
        formattedLabel = parts[0].trim() + ' · ' + parts.slice(1).join(',').trim();
      } else if (rawSlot.includes(' at ')) {
        const parts = rawSlot.split(' at ');
        formattedLabel = parts[0].trim() + ' · ' + parts[1].trim();
      } else if (rawSlot.includes(' - ')) {
        const parts = rawSlot.split(' - ');
        formattedLabel = parts[0].trim() + ' · ' + parts[1].trim();
      }

      return {
        label: formattedLabel,
        rawSlot: rawSlot,
        isConfirmed: true
      };
    }

    /**
     * Strips AI directive tags from user-facing text
     */
    cleanReply(replyText) {
      if (!replyText || typeof replyText !== 'string') return '';
      return replyText
        .replace(/\[SLOT:\s*[^\]]+\]/gi, '')
        .replace(/(?:^|\n)\s*SLOT:\s*[^\n]+/gi, '')
        .trim();
    }

    /**
     * Renders bespoke tactile Slot Card with Accept Slot & Change Time buttons
     */
    renderSlotActionCard(slotInfo) {
      const slotLabel = (slotInfo && slotInfo.label) || "On-Site Assessment Slot";
      const isConfirmed = slotInfo && slotInfo.isConfirmed;
      const safeLabel = slotLabel.replace(/"/g, '&quot;');

      return `
        <div class="mt-2.5 w-full flex flex-col gap-2 rounded-2xl bg-surface-container-low/95 border border-outline-variant/30 p-3 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="material-symbols-outlined text-[16px] text-primary flex-shrink-0" style="font-variation-settings: 'FILL' 1;">event_available</span>
              <span class="font-headline-sm text-[12px] sm:text-[13px] text-primary font-bold truncate">${safeLabel}</span>
            </div>
            <span class="font-label-sm text-[10px] text-secondary font-semibold uppercase tracking-wider flex-shrink-0">${isConfirmed ? 'Reserved' : 'Available'}</span>
          </div>
          
          <div class="flex flex-wrap items-center gap-2 pt-0.5">
            <!-- Accept Slot button (Primary CTA) -->
            <button type="button" onclick="window.handleAcceptSlot('${safeLabel}')" class="flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md text-[12px] font-bold shadow-xs transition-all active:scale-95 cursor-pointer">
              <span class="material-symbols-outlined text-[15px] text-[#ffdea6]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
              <span>Accept Slot</span>
            </button>
            
            <!-- Change Time button (Secondary CTA) -->
            <button type="button" onclick="window.handleChangeTime('${safeLabel}')" class="flex-1 min-w-[125px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-highest/90 hover:bg-surface-container-highest text-on-surface font-label-md text-[12px] font-semibold border border-outline-variant/40 transition-all active:scale-95 cursor-pointer">
              <span class="material-symbols-outlined text-[15px] text-secondary">calendar_month</span>
              <span>Change Time</span>
            </button>
          </div>

          <!-- Prompt context filler link -->
          <button type="button" onclick="window.putContextInPrompt('I would like to lock in this slot: ${safeLabel}')" class="text-left font-label-sm text-[10.5px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 pt-0.5 pl-0.5 group">
            <span class="material-symbols-outlined text-[12px] text-secondary group-hover:translate-x-0.5 transition-transform">edit_note</span>
            <span>Put into message box to add notes</span>
          </button>
        </div>
      `;
    }

    /**
     * Mounts the Consultation History Modal into document.body
     */
    ensureHistoryModalMounted() {
      if (document.getElementById('arborist-history-modal-overlay')) return;

      const overlay = document.createElement('div');
      overlay.id = 'arborist-history-modal-overlay';
      overlay.className = 'fixed inset-0 z-[999] hidden items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm opacity-0 transition-opacity duration-300';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Consultation History Logs');

      overlay.innerHTML = `
        <div id="arborist-history-sheet" class="w-full sm:max-w-lg bg-[#f2fcf2] text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/30 max-h-[85vh] flex flex-col overflow-hidden transform translate-y-8 sm:translate-y-4 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.15,0.85,0.35,1)]">
          <!-- Mobile Pull Bar -->
          <div class="w-10 h-1.5 rounded-full bg-outline-variant/40 mx-auto mt-2.5 mb-1 sm:hidden flex-shrink-0"></div>
          
          <!-- Modal Header -->
          <div class="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between gap-3 flex-shrink-0 bg-surface-container-lowest/80 backdrop-blur-md">
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[22px]">segment</span>
                <h3 class="font-display-serif text-[20px] sm:text-[22px] font-bold text-primary truncate leading-tight">Consultation Logs</h3>
              </div>
              <p class="font-body-sm text-[12px] text-on-surface-variant/80 truncate">Saved conversations on this device</p>
            </div>
            
            <div class="flex items-center gap-2 flex-shrink-0">
              <button type="button" onclick="window.ArboristAI.startNewSession()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md text-[12px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer" title="Start New Consultation">
                <span class="material-symbols-outlined text-[15px] text-[#ffdea6]">add</span>
                <span class="hidden sm:inline">New Chat</span>
              </button>
              <button type="button" onclick="window.ArboristAI.closeHistoryModal()" class="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center active:scale-95 transition-all cursor-pointer" aria-label="Close logs">
                <span class="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          <!-- Modal Scrollable Content -->
          <div id="arborist-history-list" class="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 divide-y divide-outline-variant/10">
            <!-- Dynamic session items injected here -->
          </div>

          <!-- Modal Footer -->
          <div class="px-5 py-3 border-t border-outline-variant/20 bg-surface-container-lowest/60 flex items-center justify-between text-[11px] text-secondary font-label-sm flex-shrink-0">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-primary">lock</span>
              <span>Stored privately on this browser</span>
            </span>
            <button type="button" onclick="window.ArboristAI.clearAllSessions()" class="text-error/80 hover:text-error hover:underline transition-colors cursor-pointer">Clear All</button>
          </div>
        </div>
      `;

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          window.ArboristAI.closeHistoryModal();
        }
      });

      document.body.appendChild(overlay);
    }

    /**
     * Renders the dynamic consultation session cards into the modal
     */
    renderHistoryModalContent() {
      this.ensureHistoryModalMounted();
      const listEl = document.getElementById('arborist-history-list');
      if (!listEl) return;

      const sessions = this.getSessionsList();
      const activeId = this.activeSessionId;

      if (!sessions || sessions.length === 0) {
        listEl.innerHTML = `
          <div class="py-12 px-4 text-center flex flex-col items-center justify-center gap-3">
            <div class="w-14 h-14 rounded-full bg-surface-container-high/60 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[28px]">chat_bubble_outline</span>
            </div>
            <div class="flex flex-col gap-1 max-w-xs">
              <h4 class="font-headline text-[15px] text-on-surface font-semibold">No Saved Consultations</h4>
              <p class="font-body text-[12px] text-on-surface-variant leading-relaxed">Your discussions with Aoife and inspection booking slots will appear here automatically.</p>
            </div>
            <button type="button" onclick="window.ArboristAI.startNewSession()" class="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-[12px] font-bold shadow-xs active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[15px] text-[#ffdea6]">add</span>
              <span>Start Consultation</span>
            </button>
          </div>
        `;
        return;
      }

      let html = '';
      sessions.forEach(s => {
        const isActive = s.id === activeId;
        const timeFormatted = this.formatLogTimestamp(s.updatedAt || s.createdAt);
        const safeTitle = (s.title || "Tree Consultation").replace(/"/g, '&quot;');
        const safeSnippet = (s.snippet || "Tree care consultation with Aoife").replace(/"/g, '&quot;');

        html += `
          <div class="pt-2 first:pt-0">
            <div onclick="window.ArboristAI.selectSession('${s.id}')" class="group relative flex flex-col gap-1.5 p-3.5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border ${isActive ? 'border-primary ring-2 ring-primary/30 shadow-sm' : 'border-outline-variant/30 hover:border-primary/40'} transition-all active:scale-[0.99] cursor-pointer">
              <!-- Top Row: Title + Active Badge + Delete Button -->
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="material-symbols-outlined text-[18px] text-primary flex-shrink-0" style="font-variation-settings: 'FILL' 1;">${s.hasSlot ? 'event_available' : 'forum'}</span>
                  <h4 class="font-headline text-[14px] font-bold text-on-surface truncate group-hover:text-primary transition-colors">${safeTitle}</h4>
                </div>
                <div class="flex items-center gap-1.5 flex-shrink-0">
                  ${isActive ? '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-headline font-bold uppercase tracking-wider">Active</span>' : ''}
                  <button type="button" onclick="event.stopPropagation(); window.ArboristAI.deleteSession('${s.id}')" aria-label="Delete consultation log" class="w-7 h-7 rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error flex items-center justify-center opacity-60 group-hover:opacity-100 transition-all cursor-pointer" title="Delete log">
                    <span class="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>

              <!-- Middle Row: Snippet / Description -->
              <p class="font-body text-[12.5px] text-on-surface-variant line-clamp-2 leading-relaxed pl-6">${safeSnippet}</p>

              <!-- Bottom Row: Time + Message Count + Slot Badge -->
              <div class="flex items-center justify-between gap-2 pt-1 pl-6">
                <span class="font-label-sm text-[11px] text-secondary font-medium">${timeFormatted}</span>
                <div class="flex items-center gap-1.5">
                  ${s.slotLabel ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ffdea6]/40 text-primary font-label-sm text-[10.5px] font-bold"><span class="material-symbols-outlined text-[12px] text-amber-700" style="font-variation-settings: 'FILL' 1;">calendar_today</span><span>${s.slotLabel}</span></span>` : ''}
                  <span class="font-label-sm text-[10.5px] text-on-surface-variant/70">${s.messageCount || 1} msg${(s.messageCount || 1) === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      });

      listEl.innerHTML = html;
    }

    openHistoryModal() {
      this.ensureHistoryModalMounted();
      this.renderHistoryModalContent();
      const overlay = document.getElementById('arborist-history-modal-overlay');
      const sheet = document.getElementById('arborist-history-sheet');
      if (!overlay || !sheet) return;

      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      void overlay.offsetHeight;
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
      sheet.classList.remove('translate-y-8', 'sm:translate-y-4', 'opacity-0');
      sheet.classList.add('translate-y-0', 'opacity-100');
    }

    closeHistoryModal() {
      const overlay = document.getElementById('arborist-history-modal-overlay');
      const sheet = document.getElementById('arborist-history-sheet');
      if (!overlay || !sheet) return;

      overlay.classList.remove('opacity-100');
      overlay.classList.add('opacity-0');
      sheet.classList.remove('translate-y-0', 'opacity-100');
      sheet.classList.add('translate-y-8', 'sm:translate-y-4', 'opacity-0');

      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
      }, 280);
    }

    /**
     * Renders a stored session's messages directly into a DOM container
     */
    renderSessionMessages(containerEl, session, options = {}) {
      if (!containerEl || !session) return;
      containerEl.innerHTML = '';

      const msgs = session.messages || [];
      if (msgs.length === 0) {
        if (typeof options.onEmpty === 'function') {
          options.onEmpty();
        }
        return;
      }

      msgs.forEach(m => {
        if (m.role === 'user') {
          const userTurn = document.createElement('div');
          userTurn.className = 'flex justify-end w-full pl-8 animate-fade-in';
          let photoSnippet = '';
          if (m.photoPreviewUrl) {
            photoSnippet = `<div class="mb-2 max-w-[200px] overflow-hidden rounded-xl border border-white/20"><img src="${m.photoPreviewUrl}" class="w-full h-28 object-cover" alt="Uploaded tree photo"></div>`;
          }
          const timeFormatted = this.formatLogTimestamp(m.timestamp);
          userTurn.innerHTML = `
            <div class="flex flex-col items-end gap-1 max-w-[85%]">
              <div class="bg-primary-container text-on-primary font-body-md text-[15px] leading-relaxed px-4 py-3 rounded-2xl rounded-br-xs shadow-sm">
                ${photoSnippet}
                <p>${escapeHtml(m.text)}</p>
              </div>
              <span class="font-label-sm text-[10px] text-on-surface-variant/70 pr-1">${timeFormatted}</span>
            </div>
          `;
          containerEl.appendChild(userTurn);
        } else if (m.role === 'model') {
          const cleanText = m.cleanText || this.cleanReply(m.text);
          const slotProposal = m.slot || this.detectSlotProposal(m.text);
          const slotCardHtml = slotProposal ? this.renderSlotActionCard(slotProposal) : '';
          const timeFormatted = this.formatLogTimestamp(m.timestamp);

          const aiTurn = document.createElement('div');
          aiTurn.className = 'flex items-start gap-2.5 w-full pr-4 animate-fade-in';
          aiTurn.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
              <span class="material-symbols-outlined text-on-primary text-[16px]" style="font-variation-settings: 'FILL' 1;">eco</span>
            </div>
            <div class="flex flex-col items-start gap-2 max-w-[88%] w-full">
              <div class="bg-surface-container-lowest text-on-surface font-body-md text-[15px] leading-relaxed px-4 py-3 rounded-2xl rounded-tl-xs shadow-sm flex flex-col gap-2">
                <p>${escapeHtml(cleanText)}</p>
              </div>
              ${slotCardHtml}
              <div class="flex items-center gap-2 pl-1">
                <span class="font-label-sm text-[10px] text-secondary">Aoife · Tree Care Coordinator</span>
                <span class="font-label-sm text-[10px] text-secondary/60">· ${timeFormatted}</span>
              </div>
            </div>
          `;
          containerEl.appendChild(aiTurn);
        }
      });

      if (typeof options.onRendered === 'function') {
        options.onRendered(msgs.length);
      }
    }
  }

  window.handleAcceptSlot = function(slot) {
    if (slot) {
      try { sessionStorage.setItem('arborist_selected_slot', slot); } catch(e) {}
    }
    if (typeof window.openBookingModal === 'function') {
      window.openBookingModal(null, 3);
      return;
    }
    const targetUrl = 'booking.html?step=3&slot=' + encodeURIComponent(slot || '');
    if (typeof window.smoothNavigateTo === 'function') {
      window.smoothNavigateTo(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  };

  window.handleChangeTime = function(slot) {
    if (typeof window.openBookingModal === 'function') {
      window.openBookingModal(null, 3);
      return;
    }
    const targetUrl = 'booking.html?step=3';
    if (typeof window.smoothNavigateTo === 'function') {
      window.smoothNavigateTo(targetUrl);
    } else {
      window.location.href = targetUrl;
    }
  };

  window.putContextInPrompt = function(text) {
    const inputs = [
      document.getElementById('chat-input'),
      document.getElementById('userMessageInput'),
      document.getElementById('desktop-prompt-textarea')
    ].filter(Boolean);
    
    if (inputs.length === 0) return;
    const active = inputs[0];
    active.value = text;
    active.style.height = 'auto';
    const sh = active.scrollHeight;
    active.style.height = Math.min(Math.max(sh, 24), 96) + 'px';
    active.focus();
    if (typeof active.setSelectionRange === 'function') {
      active.setSelectionRange(active.value.length, active.value.length);
    }
  };

  window.ArboristAI = new ArboristAIController();
})(window);
