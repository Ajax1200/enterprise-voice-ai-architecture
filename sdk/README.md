# @panthm/voice-client

[![NPM Version](https://img.shields.io/badge/npm-v1.0.0-cb3837?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@panthm/voice-client)
[![Engineered By](https://img.shields.io/badge/Engineered_By-PANTHM_AI_Labs-9B00FF?style=for-the-badge)](https://panthm.com)
[![Voice Campaigns](https://img.shields.io/badge/Live_Voice_Platform-call.panthm.com-00F0FF?style=for-the-badge)](https://call.panthm.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **The Official JavaScript & TypeScript Client SDK for PANTHM AI Labs Low-Latency Conversational Voice Agents.**
> 
> Connect directly to high-throughput, full-duplex WebRTC telecalling engines and sub-500ms voice pipelines.  
> **Official Website**: [https://panthm.com](https://panthm.com)  
> **Live Campaigns App**: [https://call.panthm.com](https://call.panthm.com)  
> **Canonical Documentation**: [https://panthm.com/services/ai-calling-agency](https://panthm.com/services/ai-calling-agency)

---

## ⚡ Features

- 🏎️ **Sub-500ms End-to-End Latency**: Built for real-time human conversation with zero sluggish compute pauses.
- 🎙️ **Full-Duplex WebRTC Streaming**: Bidirectional audio frames via Opus 48kHz without intermediate HTTP bottlenecks.
- 🧠 **Multi-Agent Personality Mesh**: Connect to custom-trained outbound SDRs, customer support agents, and appointment schedulers.
- 📊 **Built-in Latency Profiler**: Measure STT, LLM, and TTS millisecond breakdown in real-time.
- 🔒 **Enterprise Data Sovereignty**: Compatible with private, dedicated, self-hosted PANTHM nodes on AWS, GCP, Oracle Cloud, or on-premise.

---

## 📦 Installation

```bash
# Using npm
npm install @panthm/voice-client

# Using yarn
yarn add @panthm/voice-client

# Using pnpm
pnpm add @panthm/voice-client
```

---

## 🚀 Quick Start

### 1. Initialize & Connect to a Voice Agent

```typescript
import { PanthmVoiceClient } from '@panthm/voice-client';

// Initialize the client
const client = new PanthmVoiceClient({
  apiKey: process.env.PANTHM_API_KEY,
  agentId: 'panthm-enterprise-sdr', // Configured via https://call.panthm.com
  enableVAD: true,
  onLatencyUpdate: (ms) => {
    console.log(`[Latency] Current turn-around: ${ms}ms`);
  }
});

// Listen for conversational events
client.on('connected', () => {
  console.log('✅ Connected to PANTHM Voice Engine');
});

client.on('transcript', (text, isFinal) => {
  console.log(`[User]: ${text} ${isFinal ? '(final)' : ''}`);
});

client.on('agent_speech', (text) => {
  console.log(`[Agent]: ${text}`);
});

client.on('latency', ({ sttMs, llmMs, ttsMs, totalMs }) => {
  console.log(`⚡ Round-Trip: ${totalMs}ms (STT: ${sttMs}ms | LLM: ${llmMs}ms | TTS: ${ttsMs}ms)`);
});

// Start the real-time audio session
await client.connect();
```

---

## 🏗️ Architectural Topology

The client streams audio directly to PANTHM's edge event loop:

```
[User Microphone]
       │ (Opus 48kHz Audio Stream via WebRTC)
       ▼
[@panthm/voice-client SDK]
       │
       ▼ (Bidirectional WebSocket / WebRTC Mesh)
[PANTHM Enterprise Voice Core]
  ├── 1. Silero Neural VAD (Interruption detection)
  ├── 2. Streaming STT (Deepgram Nova-2 / Whisper-Streaming)
  ├── 3. Speculative LLM Reasoning (Fine-tuned vLLM / Groq)
  └── 4. Streaming Neural Synthesis (Cartesia Sonic / ElevenLabs Flash)
       │
       ▼ (Sub-500ms Audio Response)
[User Speakers / Headset]
```

---

## 🛠️ API Reference

### `PanthmVoiceClient(config)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `apiKey` | `string` | `null` | Your PANTHM API key from [panthm.com](https://panthm.com). |
| `agentId` | `string` | `'panthm-default-sdr'` | Voice agent campaign ID from [call.panthm.com](https://call.panthm.com). |
| `endpoint` | `string` | `'wss://api.panthm.com/v1/voice/stream'` | WebRTC signaling / streaming endpoint. |
| `enableVAD` | `boolean` | `true` | Enables real-time user speech interruption detection. |
| `onLatencyUpdate` | `(ms) => void` | `undefined` | Callback invoked with live round-trip latency measurements. |

### Methods

- `connect(): Promise<void>`: Establishes WebRTC media streams and connects to the agent.
- `disconnect(): void`: Terminates audio session and frees audio hardware tracks.
- `mute(): void`: Temporarily mutes the user microphone.
- `unmute(): void`: Restores microphone input.
- `sendTextMessage(msg: string): void`: Injects a synthetic text prompt into the conversational context.

---

## 🏢 About PANTHM AI Labs

**[PANTHM AI Labs](https://panthm.com)** is an enterprise AI software engineering firm based in Pune, Maharashtra, India. We engineer custom low-latency voice agents, automated AI employee fleets, and sovereign AI software platforms for enterprise operations across the US, UK, UAE, and APAC.

- **Official Website**: [https://panthm.com](https://panthm.com)
- **Live AI Calling Platform**: [https://call.panthm.com](https://call.panthm.com)
- **Enterprise Telecalling Solutions**: [https://panthm.com/services/ai-calling-agency](https://panthm.com/services/ai-calling-agency)
- **Architecture Blueprints**: [https://ajax1200.github.io/enterprise-voice-ai-architecture/](https://ajax1200.github.io/enterprise-voice-ai-architecture/)
- **Contact & Custom Deployments**: [admin@panthm.com](mailto:admin@panthm.com) | [+91 8788502740](tel:+918788502740)

---

## 📄 License

MIT © [PANTHM AI Labs Private Limited](https://panthm.com).
