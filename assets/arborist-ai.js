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
5. APPOINTMENT TIME NEGOTIATION & CONFIRMATION:
   - When booking, offer a couple of clear slots: e.g., "We have an opening this Wednesday at 10:30 AM, or Thursday afternoon between 1:00 PM and 3:00 PM. Would either of those suit you?"
   - If they say they don't have time or are busy: "No problem at all! How about Friday morning, or Saturday between 10:00 AM and 1:00 PM?"
   - If they still can't make those or prefer their own time: "No worries at all! You can pick whatever day and time suits your schedule best right through our online booking calendar, or I can have Declan give you a quick ring."
   - When a client accepts, chooses, or confirms a slot (or agrees to a proposed time):
     Acknowledge it warmly: "Grand! I've noted that slot down for you. You can tap 'Accept Slot' below to confirm your details, or 'Change Time' if you'd like to pick another window in our live booking calendar."
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

  class ArboristAIController {
    constructor() {
      this.historyKey = 'arborist_ai_chat_history_v2';
      this.history = this.loadHistory();
      this.isGenerating = false;
    }

    loadHistory() {
      try {
        const stored = sessionStorage.getItem(this.historyKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
      return [];
    }

    saveHistory() {
      try {
        // Keep last 16 turns to avoid exceeding context
        const trimmed = this.history.slice(-16);
        sessionStorage.setItem(this.historyKey, JSON.stringify(trimmed));
      } catch (e) {}
    }

    resetHistory() {
      this.history = [];
      try { sessionStorage.removeItem(this.historyKey); } catch (e) {}
    }

    async sendMessage(userText, imageBase64, mimeType = 'image/jpeg') {
      if (this.isGenerating) {
        return "Please give me just a second to finish replying...";
      }
      this.isGenerating = true;

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
        this.saveHistory();
        return reply;

      } catch (err) {
        console.error("ArboristAI error:", err);
        // Fallback to direct Gemini
        try {
          const fallbackReply = await this._callDirectGemini(this.history);
          if (fallbackReply) {
            this.history.push({
              role: 'model',
              parts: [{ text: fallbackReply }]
            });
            this.saveHistory();
            return fallbackReply;
          }
        } catch (e2) {
          console.error("Direct fallback failed:", e2);
        }

        return "Hi there, I'm here to help! Could you describe what's going on with your tree, or would you like to schedule an inspection with Master Arborist Declan?";
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
     * Inspects text for slot proposal or negotiation patterns
     */
    detectSlotProposal(replyText) {
      if (!replyText || typeof replyText !== 'string') return null;
      const t = replyText.toLowerCase();

      // Check if it's discussing slots / booking time
      const hasSlotKeywords = /slot|opening|available|appointment|booking|schedule|inspect|assess|wednesday|thursday|friday|saturday|monday|tuesday|morning|afternoon/i.test(t);
      if (!hasSlotKeywords) return null;

      // Extract specific day/time pattern if present
      const dayMatch = t.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
      const timeMatch = t.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)|\b(?:morning|afternoon|midday|evening)\b)/i);

      let label = "Upcoming Assessment Slot";
      if (dayMatch && timeMatch) {
        const dayStr = dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1).toLowerCase();
        label = `${dayStr} · ${timeMatch[1].toUpperCase()}`;
      } else if (dayMatch) {
        const dayStr = dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1).toLowerCase();
        label = `${dayStr} Assessment Slot`;
      } else if (timeMatch) {
        label = `Inspection Slot · ${timeMatch[1].toUpperCase()}`;
      }

      return {
        label: label,
        isConfirmed: /noted|booked|confirmed|locked in|accept slot/i.test(t)
      };
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
