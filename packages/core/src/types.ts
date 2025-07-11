import { EBackground, EClass, ERace } from './lib/games';

export interface IStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface ISkills {
  acrobatics: number;
  animalHandling: number;
  arcana: number;
  athletics: number;
  deception: number;
  history: number;
  insight: number;
  intimidation: number;
  investigation: number;
  medicine: number;
  nature: number;
  perception: number;
  performance: number;
  persuasion: number;
  religion: number;
  sleightOfHand: number;
  stealth: number;
  survival: number;
}

export interface ISchema_Character {
  id: string;
  name: string;
  description: string;
  race: ERace;
  class: EClass;
  background: EBackground;
  worldId: string;
  level: number;
  experience: number;

  stats: IStats;
  skills: ISkills;
  equipment: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_Item {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_Campaign {
  id: string;
  name: string;
  worldId: string;
  players: string[];
  storyId?: string;
  state?: {
    storySummary?: string;
    notes?: string;
    chatMemory?: string[];
  };
  completedStories: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_World {
  id: string;
  name: string;
  image?: string;
  level: number;
  description: string;
  story: string;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_Story {
  id: string;
  worldId: string;
  name: string;
  level: number;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_Location {
  id: string;
  worldId: string;
  name: string;
  image?: string;
  description: string;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_NPC {
  id: string;
  worldId: string;
  name: string;
  image?: string;
  description: string;
  voice: string;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_Voice {
  id: string;
  name: string;
  description: string;
  engine: string;
  voiceId: string;
  modelId: string;
  vibe?: string;
  createdAt: number;
  updatedAt: number;
}
