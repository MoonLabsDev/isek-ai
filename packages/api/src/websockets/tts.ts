import fs from 'fs';

import { Socket } from 'socket.io';

import {
  TTS_OpenAI,
  TTS_OpenAI_Model,
  TTS_OpenAI_Voice,
} from '@moonlabs/nodejs-tools-ai';

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
    const tts = new TTS_OpenAI('output/tts/');

    // model name
    const voiceName = TTS_OpenAI_Voice.ASH;
    const modelName = TTS_OpenAI_Model.TTS_1;
    websocket_emitStatus(socket, `🤖 Using ${modelName}: ${voiceName}`);

    // generate
    filePath = await tts.generate({
      text,
      voiceId: voiceName,
      modelId: modelName,
      vibe: 'Speak like a dungeons and dragons storyteller',
    });

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
