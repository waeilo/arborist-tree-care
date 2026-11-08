# 🎙️ Voice-to-Text (STT) Architecture & Decision Standards

Whenever implementing or upgrading Voice-to-Text (Speech-to-Text / Audio Dictation) across any interface in this workspace, follow these mandatory architectural rules.

---

## 1. The Two Standard Voice-to-Text Engines

### Engine A: Browser-Native Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`)
- **How it works:** Directly initializes the browser's built-in speech engine (Google Speech in Chrome, Microsoft Speech in Edge/Windows, Apple Speech in Safari) over standard HTTPS.
- **Cost:** $0.00 forever. Zero external API keys, zero rate-limit billing, zero token charges.
- **Latency & Streaming:** **Sub-100ms instant streaming**. Supports `interimResults = true`, displaying words character-by-character / syllable-by-syllable in real-time as the speaker talks.
- **Bundle & Footprint:** 0 KB added to frontend bundle.
- **Best Suited For:** Quick prompt bars, instant search queries, live demo recordings, video presentations, and zero-cost client testing.
- **Limitations:**
  - Firefox does not enable it out-of-the-box (requires about:config flag).
  - Heavy foreign accents or noisy mechanical rooms may experience slight phonetic variance.
  - Automatic silence cutoff after 5-8 seconds of quiet.
- **Standard Fallback:** Gracefully detect absence of `SpeechRecognition` and display an unobtrusive hint: *"Press Win + H for Windows OS Voice Typing"*.

---

### Engine B: Gemini Multimodal Audio-to-Text (`Gemini 2.5 / 3.5 Flash`)
- **How it works:** Frontend captures raw audio chunks via `MediaRecorder` API, passes base64 or binary audio to a secure backend Node.js route (`/api/ai/voice-triage`), and invokes the Gemini API.
- **Cost:** Covered under Google AI Studio free tier quotas (RPM/TPM limits), followed by ultra-low per-token audio pricing.
- **Intelligence & Processing:** 
  - Capable of deep multimodal comprehension: strips background engine noise, eliminates stutters/false starts, normalizes slang, extracts technical trade specs (e.g. "3/4 inch PEX crimp valve"), and structures disorganized verbal rants into clean bullet points.
  - Cross-browser universal compatibility (works identically in Firefox, Chrome, Edge, Safari, Opera).
- **Latency:** ~400ms–800ms (chunk-and-transcribe cadence rather than continuous syllable streaming).
- **Security Requirement:** API keys must remain strictly on the backend Node.js server. Never expose Google keys in frontend client bundles.

---

## 2. Mandatory Protocol: User Engine Selection & Default Behavior

1. **Active Selection for TotalFix Prompt Bar:**
   - **Engine A (Browser Web Speech API)** is selected for the prompt bar to achieve maximum real-time streaming speed (words appearing live on camera) at zero cost.
2. **Mandatory Clarification Rule for Future Voice Integrations:**
   - Whenever any new voice-to-text or dictation feature is introduced, Antigravity must explicitly present these two options (Engine A vs Engine B) and clarify with the user which engine to bind.
