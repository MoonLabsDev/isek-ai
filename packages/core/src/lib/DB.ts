import { Collection, Db, MongoClient } from 'mongodb';
import {
  ISchema_Character,
  ISchema_Item,
  ISchema_Location,
  ISchema_NPC,
  ISchema_World,
} from '../types';
import { DnD } from './games';

import 'dotenv/config';

export class DB {
  // --- properties ---

  private readonly client: MongoClient;
  private db: Db | null = null;

  private collections: {
    worlds: Collection<ISchema_World> | null;
    characters: Collection<ISchema_Character> | null;
    items: Collection<ISchema_Item> | null;
    locations: Collection<ISchema_Location> | null;
    npcs: Collection<ISchema_NPC> | null;
  } = {
    worlds: null,
    characters: null,
    items: null,
    locations: null,
    npcs: null,
  };

  // --- create ---

  public constructor() {
    this.client = new MongoClient(process.env.MONGO_URI!);
  }

  // --- connect ---

  public async connect() {
    await this.client.connect();
    this.db = this.client.db(process.env.MONGO_DB!);

    // get collections
    this.collections.worlds = this.db?.collection('worlds');
    this.collections.characters = this.db?.collection('characters');
    this.collections.items = this.db?.collection('items');
    this.collections.locations = this.db?.collection('locations');
    this.collections.npcs = this.db?.collection('npcs');
  }

  public async disconnect() {
    await this.client.close();
  }

  // --- setup ---
  public async setup() {
    // create indexes
    {
      // worlds
      await this.collections.worlds?.createIndex({ id: 1 }, { unique: true });
    }
    {
      // characters
      await this.collections.characters?.createIndex(
        { id: 1 },
        { unique: true }
      );
      await this.collections.characters?.createIndex({ world: 1 });
    }
    {
      // items
      await this.collections.items?.createIndex({ id: 1 }, { unique: true });
    }
    {
      // locations
      await this.collections.locations?.createIndex(
        { id: 1 },
        { unique: true }
      );
    }
  }

  // --- world functions ---

  public async createWorld(
    world: Omit<ISchema_World, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    // generate metadata
    const genWorld: ISchema_World = {
      id: crypto.randomUUID(),
      ...world,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // check if world already exists
    const existingWorld = await this.collections.worlds?.findOne({
      id: genWorld.id,
    });
    if (existingWorld) throw new Error('World already exists');

    // create world
    await this.collections.worlds?.insertOne(genWorld);

    return genWorld;
  }

  public async getWorld(id: string) {
    // get world
    const world = await this.collections.worlds?.findOne({ id });
    return world;
  }

  public async getWorlds() {
    // get worlds
    const worlds = await this.collections.worlds?.find().toArray();
    return worlds;
  }

  public async setWorldImage(worldId: string, imageUrl: string) {
    // update world's image
    const result = await this.collections.worlds?.updateOne(
      { id: worldId },
      {
        $set: {
          image: imageUrl,
          updatedAt: Date.now(),
        },
      }
    );

    if (!result || result.matchedCount === 0) {
      throw new Error('World not found');
    }

    return result;
  }

  // --- character functions ---

  public async createCharacter(
    character: Omit<
      ISchema_Character,
      'id' | 'equipment' | 'level' | 'experience' | 'createdAt' | 'updatedAt'
    >
  ) {
    // generate metadata
    const genCharacter: ISchema_Character = {
      id: crypto.randomUUID(),
      ...character,
      equipment: {},
      level: 1,
      experience: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // check if character already exists
    const existingCharacter = await this.collections.characters?.findOne({
      id: genCharacter.id,
    });
    if (existingCharacter) throw new Error('Character already exists');

    // check stats
    const statPoints = Object.values(genCharacter.stats).reduce(
      (acc, stat) => acc + (stat - DnD.baseStat),
      0
    );
    if (statPoints !== DnD.inititialStatPoints)
      throw new Error(`Stats must sum to ${DnD.inititialStatPoints}`);

    // create character
    await this.collections.characters?.insertOne(genCharacter);

    return genCharacter;
  }

  public async getCharacter(id: string) {
    // get character
    const character = await this.collections.characters?.findOne({ id });
    return character;
  }

  public async getWorldCharacters(worldId: string) {
    // get characters
    const characters = await this.collections.characters
      ?.find({ world: worldId })
      .toArray();
    return characters;
  }

  public async updateCharacterWorld(characterId: string, worldId: string) {
    // update character's worldId
    const result = await this.collections.characters?.updateOne(
      { id: characterId },
      {
        $set: {
          worldId,
          updatedAt: Date.now(),
        },
      }
    );

    if (!result || result.matchedCount === 0) {
      throw new Error('Character not found');
    }

    return result;
  }

  public async getAllCharacters() {
    // get all characters
    const characters = await this.collections.characters?.find().toArray();
    return characters;
  }

  // --- NPC functions ---

  public async createNPC(
    npc: Omit<ISchema_NPC, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    // generate metadata
    const genNPC: ISchema_NPC = {
      id: crypto.randomUUID(),
      ...npc,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // check if NPC already exists
    const existingNPC = await this.collections.npcs?.findOne({ id: genNPC.id });
    if (existingNPC) throw new Error('NPC already exists');

    // create NPC
    await this.collections.npcs?.insertOne(genNPC);

    return genNPC;
  }

  public async getNPC(id: string) {
    // get NPC
    const npc = await this.collections.npcs?.findOne({ id });
    return npc;
  }

  public async getWorldNPCs(worldId: string) {
    // get NPCs
    const npcs = await this.collections.npcs?.find({ worldId }).toArray();
    return npcs;
  }

  public async updateNPCVoice(npcId: string, voice: string) {
    // update NPC's voice
    const result = await this.collections.npcs?.updateOne(
      { id: npcId },
      { $set: { voice, updatedAt: Date.now() } }
    );

    if (!result || result.matchedCount === 0) {
      throw new Error('NPC not found');
    }

    return result;
  }

  public async setNPCImage(npcId: string, imageUrl: string) {
    // update NPC's image
    const result = await this.collections.npcs?.updateOne(
      { id: npcId },
      { $set: { image: imageUrl, updatedAt: Date.now() } }
    );

    if (!result || result.matchedCount === 0) {
      throw new Error('NPC not found');
    }

    return result;
  }

  // --- Location functions ---

  public async createLocation(
    location: Omit<ISchema_Location, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    // generate metadata
    const genLocation: ISchema_Location = {
      id: crypto.randomUUID(),
      ...location,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // check if location already exists
    const existingLocation = await this.collections.locations?.findOne({
      id: genLocation.id,
    });
    if (existingLocation) throw new Error('Location already exists');

    // create location
    await this.collections.locations?.insertOne(genLocation);

    return genLocation;
  }

  public async getLocation(id: string) {
    // get location
    const location = await this.collections.locations?.findOne({ id });
    return location;
  }

  public async getWorldLocations(worldId: string) {
    // get locations
    const locations = await this.collections.locations
      ?.find({ worldId })
      .toArray();
    return locations;
  }

  public async setLocationImage(locationId: string, imageUrl: string) {
    // update location's image
    const result = await this.collections.locations?.updateOne(
      { id: locationId },
      { $set: { image: imageUrl, updatedAt: Date.now() } }
    );

    if (!result || result.matchedCount === 0) {
      throw new Error('Location not found');
    }

    return result;
  }
}
