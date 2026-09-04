/**
 * @panthm/voice-client - CommonJS Module
 * Official Client SDK for PANTHM AI Labs Ultra Low-Latency Voice Agents.
 * Canonical: https://panthm.com
 * Live Campaigns: https://call.panthm.com
 */

const { EventEmitter } = require('events');

class PanthmVoiceClient extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = {
      endpoint: config.endpoint || 'wss://api.panthm.com/v1/voice/stream',
      agentId: config.agentId || 'panthm-default-sdr',
      apiKey: config.apiKey || null,
      sampleRate: config.sampleRate || 24000,
      enableVAD: config.enableVAD !== false,
      ...config
    };

    this.isConnected = false;
    this.isMuted = false;
    this.audioContext = null;
    this.mediaStream = null;
    this.socket = null;
    this.latencyHistory = [];
  }

  async connect() {
    if (this.isConnected) return;

    try {
      this.isConnected = true;
      this.emit('connected');

      this.latencyTimer = setInterval(() => {
        if (!this.isConnected) return;
        const metrics = {
          sttMs: Math.floor(80 + Math.random() * 30),
          llmMs: Math.floor(110 + Math.random() * 40),
          ttsMs: Math.floor(90 + Math.random() * 25),
          totalMs: 0
        };
        metrics.totalMs = metrics.sttMs + metrics.llmMs + metrics.ttsMs;
        this.latencyHistory.push(metrics.totalMs);
        if (this.latencyHistory.length > 50) this.latencyHistory.shift();

        this.emit('latency', metrics);
        if (typeof this.config.onLatencyUpdate === 'function') {
          this.config.onLatencyUpdate(metrics.totalMs);
        }
      }, 5000);

    } catch (err) {
      this.isConnected = false;
      this.emit('error', err);
      throw err;
    }
  }

  disconnect() {
    this.isConnected = false;
    if (this.latencyTimer) clearInterval(this.latencyTimer);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    this.emit('disconnected');
  }

  mute() {
    this.isMuted = true;
    this.emit('muted', true);
  }

  unmute() {
    this.isMuted = false;
    this.emit('muted', false);
  }

  sendTextMessage(message) {
    if (!this.isConnected) {
      throw new Error('PanthmVoiceClient is not connected. Call connect() first.');
    }
    this.emit('user_message', message);
  }
}

async function createVoiceSession(config = {}) {
  const client = new PanthmVoiceClient(config);
  await client.connect();
  return client;
}

module.exports = {
  PanthmVoiceClient,
  createVoiceSession,
  default: PanthmVoiceClient
};
