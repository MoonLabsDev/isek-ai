import chalk from 'chalk';
import fs from 'fs';

import { Server, Socket } from 'socket.io';

import { job_query, job_transcribe, job_tts } from './websockets';

export const websocket_emitChat = (
  socket: Socket,
  from: 'user' | 'assistant',
  message: string
) => {
  socket.emit('chat', { from, message });
  chalk.blue(
    `- [WS: ${chalk.yellow(socket.id)}]: 📝[${from}] => ${chalk.white(message)}`
  );
};

export const websocket_emitStatus = (socket: Socket, message: string) => {
  socket.emit('status', message);
  console.log(
    chalk.blue(`- [WS: ${chalk.yellow(socket.id)}]: ${chalk.white(message)}`)
  );
};

export const websocket_emitJobStart = (
  socket: Socket,
  type: 'user' | 'assistant',
  message: string
) => {
  socket.emit('jobStart', { type, message });
};

export const websocket_emitJobEnd = (socket: Socket) => {
  socket.emit('jobEnd');
};

export const websocket_emitTTS = (socket: Socket, filePath: string) => {
  const buffer = fs.readFileSync(filePath);
  socket.emit('tts', { audioBlob: buffer });
};

const websocket_on = (
  socket: Socket,
  event: string,
  callback: (socket: Socket, payload: any) => void
) => {
  socket.on(event, async (payload: any) => callback(socket, payload));
};

export const setup_websocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(
      chalk.blue(
        `- [WS: ${chalk.yellow(socket.id)}]: ${chalk.white('🟢 Connected')}`
      )
    );

    // disconnect
    socket.on('disconnect', () => {
      console.log(
        chalk.blue(
          `- [WS: ${chalk.yellow(socket.id)}]: ${chalk.white('🔴 Disconnected')}`
        )
      );
    });

    // jobs
    websocket_on(socket, 'transcribe', job_transcribe);
    websocket_on(socket, 'query', job_query);
    websocket_on(socket, 'tts', job_tts);
  });
};
