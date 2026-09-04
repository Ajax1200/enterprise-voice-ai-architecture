/**
 * @panthm/voice-client
 * Official TypeScript SDK for PANTHM AI Labs Low-Latency Conversational Voice Agents.
 * https://panthm.com
 */

export interface PanthmVoiceConfig {
  apiKey?: string;
  agentId?: string;
  endpoint?: string;
  sampleRate?: number;
  enableVAD?: boolean;
  onLatencyUpdate?: (latencyMs: number) => void;
}

export interface VoiceEventMap {
  'connected': () => void;
  'disconnected': () => void;
  'transcript': (text: string, isFinal: boolean) => void;
  'agent_speech': (text: string) => void;
  'latency': (metrics: { sttMs: number; llmMs: number; ttsMs: number; totalMs: number }) => void;
  'error': (err: Error) => void;
}

export declare class PanthmVoiceClient {
  constructor(config?: PanthmVoiceConfig);
  
  readonly isConnected: boolean;
  readonly isMuted: boolean;

  connect(): Promise<void>;
  disconnect(): void;
  mute(): void;
  unmute(): void;
  sendTextMessage(message: string): void;

  on<K extends keyof VoiceEventMap>(event: K, listener: VoiceEventMap[K]): this;
  off<K extends keyof VoiceEventMap>(event: K, listener: VoiceEventMap[K]): this;
}

export declare function createVoiceSession(config?: PanthmVoiceConfig): Promise<PanthmVoiceClient>;
export default PanthmVoiceClient;
