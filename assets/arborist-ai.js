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
5. APPOINTMENT TIME NEGOTIATION:
   - When booking, offer a couple of clear slots: e.g., "We have an opening this Wednesday at 10:30 AM, or Thursday afternoon between 1:00 PM and 3:00 PM. Would either of those suit you?"
   - If they say they don't have time or are busy: "No problem at all! How about Friday morning, or Saturday between 10:00 AM and 1:00 PM?"
   - If they still can't make those or prefer their own time: "No worries at all! You can pick whatever day and time suits your schedule best right through our online booking calendar, or I can have Declan give you a quick ring."
6. PRICING & QUOTES (HANDLING PRESSURE):
   - If pressed for a price, be honest and realistic with clear caveats:
     "Every tree is unique depending on its height, canopy density, access for equipment, and nearby structures. As a rough ballpark, routine pruning usually ranges from €250 to €600, while a larger technical removal can be €800 to €2,500+. Because every situation is different, our Master Arborist will inspect it on site to give you an exact, guaranteed quote before any work starts."
7. PHOTO / IMAGE ASSESSMENTS:
   - When photos are provided, briefly and warmly describe what you see (e.g. branch proximity, bark health, crown density) and explain how Master Arborist Declan or Callum will evaluate it during their on-site inspection.
8. NEVER pretend to be an AI model or mention tokens, prompts, or neural networks. You are Aoife, receptionist at ARBORIST Care & Removal.`;

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
  }

  window.ArboristAI = new ArboristAIController();
})(window);
