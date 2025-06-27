import fs from 'fs';
import path from 'path';

import { Socket } from 'socket.io';

import { transcribe_whisper } from '@moonlabs/nodejs-tools-ai';

import {
  websocket_emitJobEnd,
  websocket_emitJobStart,
  websocket_emitStatus,
} from '../websocket';
import { job_query } from './query';

import { TranscribePayload } from '../types';

export const job_transcribe = async (
  socket: Socket,
  { fileBuffer }: TranscribePayload
) => {
  // status
  websocket_emitJobStart(socket, 'user', '🎙️');
  websocket_emitStatus(socket, '🎙️ Transcribing...');

  // save file
  const fileDir = path.join(__dirname, '../../uploads/voice/');
  const filePath = path.join(fileDir, `${socket.id}.wav`);
  fs.mkdirSync(fileDir, { recursive: true });
  fs.writeFileSync(filePath, fileBuffer);

  // try transcribe
  let result: string | null = null;
  try {
    // transcribe
    result = await transcribe_whisper({ filePath });

    // status
    websocket_emitJobEnd(socket);
    websocket_emitStatus(socket, `🧾 "${result}"`);
    websocket_emitStatus(socket, '✅ Done');
  } catch (e) {
    // status
    websocket_emitJobEnd(socket);
    websocket_emitStatus(socket, '❌ Error transcribing');
    console.error(e);
  }

  // delete file
  fs.unlinkSync(filePath);

  // if error, return
  if (result === null) return;

  // execute
  await job_query(socket, { query: result });
};
