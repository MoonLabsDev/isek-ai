import { ISchema_Voice } from '../types';

export const defaultVoices: Omit<ISchema_Voice, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'default_openai_ash',
    name: 'Ash',
    description: 'A young woman with a soft, melodic voice.',
    engine: 'openai',
    voiceId: 'alloy',
    modelId: 'tts-1',
  },
];
