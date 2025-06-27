import { EBackground, EClass, ESkills, EStats } from './types';

export class DnD {
  // --- system ---
  public static systemPrompt = `
  You are a Dungeon Master for a D&D 5e game and stick to the rules. You tell wonderfull stories as a real Storyteller.
  `;

  public static readonly taskDifficulty = {
    veryEasy: 5,
    easy: 10,
    medium: 15,
    hard: 20,
    veryHard: 25,
  };

  // --- skills ---

  public static readonly skillStats = {
    [ESkills.Athletics]: EStats.Strength,

    [ESkills.Acrobatics]: EStats.Dexterity,
    [ESkills.SleightOfHand]: EStats.Dexterity,
    [ESkills.Stealth]: EStats.Dexterity,

    [ESkills.AnimalHandling]: EStats.Wisdom,
    [ESkills.Insight]: EStats.Wisdom,
    [ESkills.Medicine]: EStats.Wisdom,
    [ESkills.Perception]: EStats.Wisdom,
    [ESkills.Survival]: EStats.Wisdom,

    [ESkills.Arcana]: EStats.Intelligence,
    [ESkills.History]: EStats.Intelligence,
    [ESkills.Investigation]: EStats.Intelligence,
    [ESkills.Nature]: EStats.Intelligence,
    [ESkills.Religion]: EStats.Intelligence,

    [ESkills.Intimidation]: EStats.Charisma,
    [ESkills.Performance]: EStats.Charisma,
    [ESkills.Persuasion]: EStats.Charisma,
    [ESkills.Deception]: EStats.Charisma,
  };

  public static readonly skillPoints = {
    rogue: 4,
    bard: 3,
    barbarian: 2,
    cleric: 2,
    druid: 2,
    fighter: 2,
    monk: 2,
    paladin: 2,
    ranger: 3,
    sorcerer: 2,
    wizard: 2,
    warlock: 2,
  };

  public static readonly classProficiencies = {
    [EClass.Barbarian]: [
      ESkills.Athletics,
      ESkills.AnimalHandling,
      ESkills.Intimidation,
      ESkills.Nature,
      ESkills.Perception,
      ESkills.Survival,
    ],
    [EClass.Bard]: [] as ESkills[], // ALL
    [EClass.Cleric]: [
      ESkills.History,
      ESkills.Religion,
      ESkills.Medicine,
      ESkills.Persuasion,
      ESkills.Insight,
    ],
    [EClass.Druid]: [
      ESkills.AnimalHandling,
      ESkills.Insight,
      ESkills.Medicine,
      ESkills.Nature,
      ESkills.Perception,
      ESkills.Survival,
    ],
    [EClass.Fighter]: [
      ESkills.Acrobatics,
      ESkills.AnimalHandling,
      ESkills.Intimidation,
      ESkills.Perception,
      ESkills.Survival,
      ESkills.History,
    ],
    [EClass.Monk]: [
      ESkills.Acrobatics,
      ESkills.Athletics,
      ESkills.History,
      ESkills.Insight,
      ESkills.Religion,
      ESkills.Stealth,
    ],
    [EClass.Paladin]: [
      ESkills.Intimidation,
      ESkills.Persuasion,
      ESkills.Religion,
      ESkills.Medicine,
      ESkills.Insight,
    ],
    [EClass.Ranger]: [
      ESkills.AnimalHandling,
      ESkills.Athletics,
      ESkills.Insight,
      ESkills.Perception,
      ESkills.Stealth,
      ESkills.Survival,
    ],
    [EClass.Rogue]: [
      ESkills.Acrobatics,
      ESkills.SleightOfHand,
      ESkills.Stealth,
      ESkills.Insight,
      ESkills.Perception,
      ESkills.Persuasion,
      ESkills.Investigation,
    ],
    [EClass.Sorcerer]: [
      ESkills.Arcana,
      ESkills.History,
      ESkills.Insight,
      ESkills.Religion,
      ESkills.Medicine,
      ESkills.Investigation,
    ],
    [EClass.Warlock]: [
      ESkills.Arcana,
      ESkills.Deception,
      ESkills.Persuasion,
      ESkills.Religion,
      ESkills.Intimidation,
    ],
    [EClass.Wizard]: [
      ESkills.Arcana,
      ESkills.History,
      ESkills.Insight,
      ESkills.Investigation,
      ESkills.Religion,
      ESkills.Medicine,
    ],
  };

  public static readonly proficiencyLevelBonus = [
    2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6,
  ];

  public static readonly backgroundSkills = {
    [EBackground.Acolyte]: [ESkills.Insight, ESkills.Religion],
    [EBackground.Charlatan]: [ESkills.Deception, ESkills.SleightOfHand],
    [EBackground.Criminal]: [ESkills.Deception, ESkills.Stealth],
    [EBackground.Entertainer]: [ESkills.Acrobatics, ESkills.Performance],
    [EBackground.FolkHero]: [ESkills.AnimalHandling, ESkills.Survival],
    [EBackground.GuildArtisan]: [ESkills.Insight, ESkills.Persuasion],
    [EBackground.Hermit]: [
      ESkills.Medicine,
      ESkills.Religion,
      ESkills.Survival,
    ],
    [EBackground.Noble]: [
      ESkills.History,
      ESkills.Persuasion,
      ESkills.Survival,
    ],
    [EBackground.Outlander]: [
      ESkills.Athletics,
      ESkills.Perception,
      ESkills.Survival,
    ],
    [EBackground.Sage]: [
      ESkills.Arcana,
      ESkills.History,
      ESkills.Investigation,
    ],
    [EBackground.Sailor]: [
      ESkills.Athletics,
      ESkills.Perception,
      ESkills.Survival,
    ],
  };

  // --- stats ---

  public static readonly baseStat = 8;
  public static readonly inititialStatPoints = 27;

  // --- functions ---

  public static rollDice(dice: number) {
    const roll = Math.floor(Math.random() * dice) + 1;
    return roll;
  }
}
