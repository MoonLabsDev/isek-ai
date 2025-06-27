import { Socket } from 'socket.io';

import { LLM_Client_OpenAI } from '@moonlabs/nodejs-tools-ai';

import {
  websocket_emitChat,
  websocket_emitJobEnd,
  websocket_emitJobStart,
  websocket_emitStatus,
} from '../websocket';

import { QueryPayload } from '../types';

export const job_query = async (
  socket: Socket,
  { fileNames, query }: QueryPayload
) => {
  // status
  websocket_emitStatus(socket, '⚙️  Received Query...');

  // chat message (user)
  websocket_emitChat(socket, 'user', query);

  // status
  websocket_emitJobStart(socket, 'assistant', '🤖');

  // llm
  try {
    // init LLM
    const llm = new LLM_Client_OpenAI();
    await llm.init();

    // model name
    const modelName = llm.getModelName();
    websocket_emitStatus(socket, `🤖 Using ${modelName}`);

    // prompt
    const response = await llm.prompt('', query);

    // chat message (assistant)
    websocket_emitChat(socket, 'assistant', response);

    // status
    websocket_emitJobEnd(socket);
    websocket_emitStatus(socket, '✅ Done');
  } catch (e) {
    // status
    websocket_emitJobEnd(socket);
    websocket_emitStatus(socket, '❌ Error in LLM');
    console.error(e);
  }
};
