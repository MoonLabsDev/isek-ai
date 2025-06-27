export interface ISchema_World {
  id: string;
  name: string;
  level: number;
  description: string;
  story: string;
  createdAt: number;
  updatedAt: number;
}

export interface ISchema_Character {
  id: string;
  name: string;
  description: string;
  race: string;
  class: string;
  background: string;
  worldId: string;
  level: number;
  experience: number;

  stats: Record<string, number>;
  skills: Record<string, number>;
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

export interface ISchema_Location {
  id: string;
  worldId: string;
  name: string;
  description: string;
  type: string;
  coordinates: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}
