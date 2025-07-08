import {
  LLM_Client_OpenAI,
  TTS_ElevenLabs,
  TextToImage_OpenAI,
} from '@moonlabs/nodejs-tools-ai';

import { DB } from './DB';
import { DnD } from './games/DnD/DnD';

export class IsekAI {
  // --- properties ---

  private readonly llm_logic: LLM_Client_OpenAI;
  private readonly llm_creative: LLM_Client_OpenAI;
  private readonly tts: TTS_ElevenLabs;
  private readonly db: DB;
  private readonly textToImage: TextToImage_OpenAI;

  // --- create ---

  public constructor() {
    this.llm_logic = new LLM_Client_OpenAI(true, 0);
    this.llm_creative = new LLM_Client_OpenAI(false, 0.7);
    this.tts = new TTS_ElevenLabs('./generated/voices');
    this.db = new DB();
    this.textToImage = new TextToImage_OpenAI('dall-e-3');
  }

  public async init() {
    await this.db.connect();
    await this.llm_logic.init();
    await this.llm_creative.init();
  }

  // --- generate functions ---

  public async generateImage(prompt: string) {
    const image = await this.textToImage.generateImage_Base64(prompt);
    return image;
  }

  public async generateWorld(
    worldName: string,
    description: string,
    level: number
  ) {
    // generate world
    const world = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
      Generate a world description as context for a system prompt.
      The user will give you a name and a world description. Modify the description to be short and precise to give the AI a description of the world to generate.
      The user will supply name and description. Only write the description and nothing else.

      ### Output Format:
      World:
      - Name: <world name>
      - Level: <world level>
      - Description: <world description>     
      `,
      `World name: ${worldName}
      Character level: ${level}
      World Description: ${description}
      `
    );

    // generate story
    const story = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
      Generate a story for the world and sketch out the story as multiple steps as a rough script. Make a list of important places and NPCs with anme and a very short description
      The user will supply a world description. Only write the story plot, NPCs and locations as list and nothing else. The Story should have at least 7 steps and has to be a complete story without open ends.

      ### Output Format:
      Story:
      - <story step 1>
      - <story step 2>
      - <story step 3>
      - ...

      `,
      `###${world}`
    );

    // enerate locations
    const locations = await this.generateLocations(
      worldName,
      description,
      story
    );

    // extract and generate NPCs
    const npcs = await this.generateNPCs(worldName, description, story);

    // return
    return {
      name: worldName,
      level,
      description: world,
      story,
      locations,
      npcs,
    };
  }

  private async generateLocations(
    worldId: string,
    worldDescription: string,
    story: string
  ) {
    // generate locations
    const locations = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
      Extract the locations from the story and generate a list of locations with a name and a very short description.
      The user will supply a story and the world description. Only write the locations as list and nothing else.

      ### Output Format:
      Locations:
      - <location name 1>: <location description>
      - <location name 2>: <location description>
      - <location name 3>: <location description>
      - ...

      `,
      `### ${worldDescription}

      ### ${story}`
    );

    // extract locations
    const extractedLocations = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
      Extract the locations from the input and format it as JSON like this:

      [
        {
          "name": <location name 1>,
          "description": <location description 1>,
        },
        {
          "name": <location name 2>,
          "description": <location description 2>,
        }
      ]
      `,
      locations
    );

    // parse JSON and create locations
    const json = JSON.parse(extractedLocations);
    for (const l of json) {
      await this.db.createLocation({
        worldId,
        name: l.name as string,
        description: l.description as string,
      });
    }

    return locations;
  }

  private async generateNPCs(
    worldId: string,
    worldDescription: string,
    story: string
  ) {
    // generate NPCs
    const npcs = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
      Extract the NPCs from the story and generate a list of importantNPCs with a name and a very short description.
      The user will supply a story and the world description. Only write the NPCs as list and nothing else. Only special and important individuals should be included.
      The description should be short and precise, cover their looks, personality, background and role in the story and how they sound.

      ### Output Format:
      NPCs:
      - <NPC name 1>: <NPC description>
      - <NPC name 2>: <NPC description>
      - <NPC name 3>: <NPC description>
      - ...
      `,
      `### ${worldDescription}

      ### ${story}`
    );

    // extract NPCs
    const extractedNPCs = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
      Extract the NPCs from the input and format it as JSON like this:

      [
        {
          "name": <NPC name 1>,
          "description": <NPC description 1>,
        },
        {
          "name": <NPC name 2>,
          "description": <NPC description 2>,
        }
      ]
      `,
      npcs
    );

    // parse JSON and create NPCs
    const json = JSON.parse(extractedNPCs);
    for (const n of json) {
      await this.db.createNPC({
        worldId,
        name: n.name as string,
        description: n.description as string,
        voice: '',
      });
    }

    return npcs;
  }

  public async generateCharacter(
    characterName: string,
    characterDescription: string
  ) {
    // generate character
    const character = await this.llm_creative.prompt(
      DnD.systemPrompt,
      `Generate a character with the following name: ${characterName} and description: ${characterDescription}`
    );
  }

  // --- tools ---
}
