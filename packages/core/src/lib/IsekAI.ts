import { LLM_Client_OpenAI, TTS_ElevenLabs } from '@moonlabs/nodejs-tools-ai';

import { DB } from './DB';
import { DnD } from './games/DnD/DnD';

export class IsekAI {
  // --- properties ---

  private readonly llm_logic: LLM_Client_OpenAI;
  private readonly llm_creative: LLM_Client_OpenAI;
  private readonly tts: TTS_ElevenLabs;
  private readonly db: DB;

  // --- create ---

  public constructor() {
    this.llm_logic = new LLM_Client_OpenAI();
    this.llm_creative = new LLM_Client_OpenAI();
    this.tts = new TTS_ElevenLabs('./generated/voices');
    this.db = new DB();
  }

  public async init() {
    await this.db.connect();
    await this.llm_logic.init();
    await this.llm_creative.init();
  }

  // --- functions ---

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
      The user will supply name and description.
      `,
      `World name: ${worldName}
      Character level: ${level}
      World Description: ${description}
      `
    );

    // generate story
    const story = await this.llm_creative.prompt(
      `${DnD.systemPrompt}
        
        === World:
        ${world}`,
      `Generate a story for the world and sketch out the story as multiple steps as a rough script. Make a list of important places and NPCs with anme and a very short description`
    );

    // return
    return {
      name: worldName,
      level,
      description: world,
      story,
    };
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
