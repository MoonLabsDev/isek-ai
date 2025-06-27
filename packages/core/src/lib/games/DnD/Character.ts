import { ISchema_Character, IStats } from '../../../types';
import { DnD } from './DnD';
import { EBackground, EClass, ERace, ESkills } from './types';

const chars: Record<string, DnD_Character> = {};

export function getCharacter(id: string, info: ISchema_Character) {
  const char = chars[id];
  if (char) return char;
  const newChar = new DnD_Character(
    id,
    info.name,
    ERace.Human,
    EClass.Rogue,
    EBackground.Criminal,
    []
  );
  chars[id] = newChar;
  return newChar;
}

export class DnD_Character {
  private readonly id: string;

  private readonly name: string;
  private readonly race: ERace;
  private readonly class: EClass;
  private readonly background: EBackground;

  private readonly stats: IStats;
  private readonly skills: ESkills[];
  private readonly equipment: Record<string, number>;
  private readonly inventory: Record<string, number>;
  private readonly money: Record<string, number>;
  private _level: number = 1;
  private _experience: number = 0;

  // --- getters ---
  public get level(): number {
    return this._level;
  }

  public get experience(): number {
    return this._experience;
  }

  // --- create ---

  public constructor(
    id: string,
    name: string,
    race: ERace,
    classType: EClass,
    background: EBackground,
    proficiency: ESkills[]
  ) {
    // base
    this.id = id;
    this.name = name;

    // race, class, background
    this.race = race;
    this.class = classType;
    this.background = background;

    // check
    const classProficiencies = DnD.classProficiencies[this.class];
    if (classProficiencies.length > 0) {
      for (const p of proficiency)
        if (!classProficiencies.includes(p))
          throw new Error(`Skill ${p} is not a proficiency of ${this.class}`);
    }

    // stats
    this.stats = {
      strength: DnD.baseStat,
      dexterity: DnD.baseStat,
      constitution: DnD.baseStat,
      intelligence: DnD.baseStat,
      wisdom: DnD.baseStat,
      charisma: DnD.baseStat,
    };

    // proficiency
    this.skills = proficiency;
    DnD.backgroundSkills[this.background].forEach(s => {
      if (!this.skills.includes(s)) this.skills.push(s);
    });

    this.equipment = {};
    this.inventory = {};
    this.money = {};
  }

  // --- skill functions ---

  public rollSkill(skill: ESkills) {
    const modifier = this.getSkillModifier(skill);
    const proficiencyBonus = this.getSkillProficiencyBonus(skill);
    const roll = DnD.rollDice(20) + modifier + proficiencyBonus;
    return {
      roll,
      modifier,
      proficiencyBonus,
      total: roll + modifier + proficiencyBonus,
    };
  }

  public getSkillModifier(skill: ESkills) {
    const stat = DnD.skillStats[skill];
    const modifier = Math.floor((this.stats[stat] - 10) / 2);
    return modifier;
  }

  public getSkillProficiencyBonus(skill: ESkills) {
    const levelMultiplier = DnD.proficiencyLevelBonus[this.level - 1];
    const proficiencyBonus = this.skills.includes(skill) ? levelMultiplier : 0;
    return proficiencyBonus;
  }

  public static isBackgroundSkill(skill: ESkills, background: EBackground) {
    return DnD.backgroundSkills[background].includes(skill);
  }
}
