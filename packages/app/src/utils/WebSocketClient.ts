import axios from 'axios';

import io, { Socket } from 'socket.io-client';

export type WebSocketClientEvents =
  | 'onStatus'
  | 'onChat'
  | 'onTTS'
  | 'onJobStart'
  | 'onJobEnd';
export type WebSocketChatTypes = 'user' | 'assistant';

export type WebSocketClientOnStatus = (msg: string) => void;
export type WebSocketClientOnChat = (
  from: WebSocketChatTypes,
  message: string
) => void;
export type WebSocketClientOnTTS = (audioBlob: Blob) => void;
export type WebSocketClientOnJobStart = (
  type: WebSocketChatTypes,
  message: string
) => void;
export type WebSocketClientOnJobEnd = () => void;

let webSocketClient: WebSocketClient | null = null;

export const getWebSocketClient = (
  useLocalhost: boolean = false,
  useHttps: boolean = false
) => {
  if (webSocketClient === null) {
    webSocketClient = new WebSocketClient(useLocalhost, useHttps);
  }
  return webSocketClient;
};

export class WebSocketClient {
  // --- attributes ---

  private readonly baseUrl: string;
  private readonly secure: boolean;
  private socket: Socket | null = null;
  private readonly events: {
    onStatus: WebSocketClientOnStatus[];
    onChat: WebSocketClientOnChat[];
    onTTS: WebSocketClientOnTTS[];
    onJobStart: WebSocketClientOnJobStart[];
    onJobEnd: WebSocketClientOnJobEnd[];
  } = {
    onStatus: [],
    onChat: [],
    onTTS: [],
    onJobStart: [],
    onJobEnd: [],
  };

  // --- create ---

  public constructor(useLocalhost: boolean = false, secure: boolean = false) {
    this.secure = secure;
    this.baseUrl = `${this.secure ? 'wss' : 'ws'}://${
      useLocalhost ? 'localhost' : 'pc.loesil.com'
    }:${this.secure ? 3002 : 3001}`;
  }

  // --- start / stop ---

  public start() {
    // check
    if (this.socket !== null) return;

    // connect
    this.socket = io(this.baseUrl, { secure: this.secure });

    // add listeners
    this.socket.on('status', (msg: string) => {
      this.events.onStatus.forEach(cb => cb(msg));
    });
    this.socket.on(
      'chat',
      ({ from, message }: { from: WebSocketChatTypes; message: string }) => {
        this.events.onChat.forEach(cb => cb(from, message));
      }
    );
    this.socket.on('tts', ({ audioBlob }: { audioBlob: Blob }) => {
      this.events.onTTS.forEach(cb => cb(audioBlob));
    });
    this.socket.on(
      'jobStart',
      ({ type, message }: { type: WebSocketChatTypes; message: string }) => {
        this.events.onJobStart.forEach(cb => cb(type, message));
      }
    );
    this.socket.on('jobEnd', () => {
      this.events.onJobEnd.forEach(cb => cb());
    });

    // log
    console.log(
      `🟢 Connected to [${this.baseUrl}]${this.secure ? ' (secure)' : ''}`
    );
  }

  public stop() {
    // check
    if (this.socket === null) return;

    // remove listeners
    this.socket.off('status');
    this.socket.off('chat');
    this.socket.off('query');
    this.socket.off('jobStart');
    this.socket.off('jobEnd');

    // close
    this.socket.close();
    this.socket = null;

    // log
    console.log(`🔴 Disconnected`);
  }

  // --- functions ---

  public async uploadFiles(files: File[]): Promise<string[]> {
    if (!files.length) return [];

    // form data
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    // upload
    const res = await axios.post(`${this.baseUrl}/upload`, formData);
    const fileNames = res.data.files.map((f: any) => f.filename as string);

    return fileNames;
  }

  // --- jobs ---

  public async transcribe(audioBlob: Blob) {
    // check
    if (this.socket === null) return;
    if (audioBlob.type !== 'audio/wav') return;

    // emit
    const fileBuffer = await audioBlob.arrayBuffer();
    this.socket.emit('transcribe', { fileBuffer });
  }

  public async query(query: string, fileNames?: string[]) {
    // check
    if (this.socket === null) return;
    const cleanQuery = query
      .trim()
      .replaceAll('\r', '')
      .replaceAll('\n', '')
      .replaceAll('\t', '');
    if (cleanQuery === '') return;

    // emit
    this.socket.emit('query', { query: cleanQuery, fileNames });
  }

  public async tts(text: string) {
    // check
    if (this.socket === null) return;
    const cleanText = text
      .trim()
      .replaceAll('\r', '')
      .replaceAll('\n', '')
      .replaceAll('\t', '');
    if (cleanText === '') return;

    // emit
    this.socket.emit('tts', { text: cleanText });
  }

  // --- event functions ---

  public on(event: WebSocketClientEvents, callback: (...args: any[]) => void) {
    this.events[event].push(callback);
  }

  public off(event: WebSocketClientEvents) {
    this.events[event] = [];
  }
}
