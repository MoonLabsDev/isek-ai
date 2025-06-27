import fs from 'fs';

import { Socket } from 'socket.io';

import { TTS_Gradio_XTTS } from '@moonlabs/nodejs-tools-ai';

import {
  websocket_emitJobEnd,
  websocket_emitJobStart,
  websocket_emitStatus,
  websocket_emitTTS,
} from '../websocket';

import { TTSPayload } from '../types';

export const job_tts = async (socket: Socket, { text }: TTSPayload) => {
  // status
  websocket_emitJobStart(socket, 'assistant', '🔊');
  websocket_emitStatus(socket, '🔊 Generating speech...');

  // try generate speech
  let filePath: string | null = null;
  try {
    // tts
    const tts = new TTS_Gradio_XTTS();

    // model name
    const voiceName = 'default';
    const modelName = tts.ttsModel;
    websocket_emitStatus(socket, `🤖 Using ${modelName}: ${voiceName}`);

    // generate
    filePath = await tts.generate({ text, language: 'en' });

    // status
    websocket_emitJobEnd(socket);
    websocket_emitStatus(socket, '✅ Done');
  } catch (e) {
    // status
    websocket_emitJobEnd(socket);
    websocket_emitStatus(socket, '❌ Error generating speech');
    console.error(e);
  }

  // if error, return
  if (filePath === null) return;

  // emit result
  websocket_emitTTS(socket, filePath);

  // delete file
  fs.unlinkSync(filePath);
};
