import {
  DnD,
  EBackground,
  EClass,
  ERace,
} from '@moonlabs/isek-ai-core/src/lib/games/DnD';
import { ESkills } from '@moonlabs/isek-ai-core/src/lib/games/DnD/types';

// Race icons
export const raceIcons = {
  [ERace.Dragonborn]: '🐉',
  [ERace.Dwarf]: '⛏️',
  [ERace.Elf]: '🏹',
  [ERace.Gnome]: '🔧',
  [ERace.HalfElf]: '🧝',
  [ERace.HalfOrc]: '🪓',
  [ERace.Human]: '👤',
  [ERace.Tiefling]: '😈',
};

export const raceNames = {
  [ERace.Dragonborn]: 'Dragonborn',
  [ERace.Dwarf]: 'Dwarf',
  [ERace.Elf]: 'Elf',
  [ERace.Gnome]: 'Gnome',
  [ERace.HalfElf]: 'Half-Elf',
  [ERace.HalfOrc]: 'Half-Orc',
  [ERace.Human]: 'Human',
  [ERace.Tiefling]: 'Tiefling',
};

// Class icons
export const classIcons = {
  [EClass.Barbarian]: '⚔️',
  [EClass.Bard]: '🎵',
  [EClass.Cleric]: '⛪',
  [EClass.Druid]: '🌿',
  [EClass.Fighter]: '🛡️',
  [EClass.Monk]: '🥋',
  [EClass.Paladin]: '⚜️',
  [EClass.Ranger]: '🏹',
  [EClass.Rogue]: '🗡️',
  [EClass.Sorcerer]: '✨',
  [EClass.Warlock]: '👹',
  [EClass.Wizard]: '📚',
};

export const classNames = {
  [EClass.Barbarian]: 'Barbarian',
  [EClass.Bard]: 'Bard',
  [EClass.Cleric]: 'Cleric',
  [EClass.Druid]: 'Druid',
  [EClass.Fighter]: 'Fighter',
  [EClass.Monk]: 'Monk',
  [EClass.Paladin]: 'Paladin',
  [EClass.Ranger]: 'Ranger',
  [EClass.Rogue]: 'Rogue',
  [EClass.Sorcerer]: 'Sorcerer',
  [EClass.Warlock]: 'Warlock',
  [EClass.Wizard]: 'Wizard',
};

// Background icons
export const backgroundIcons = {
  [EBackground.Acolyte]: '⛪',
  [EBackground.Charlatan]: '🎭',
  [EBackground.Criminal]: '🦹',
  [EBackground.Entertainer]: '🎪',
  [EBackground.FolkHero]: '🏆',
  [EBackground.GuildArtisan]: '🏭',
  [EBackground.Hermit]: '🏔️',
  [EBackground.Noble]: '👑',
  [EBackground.Outlander]: '🌲',
  [EBackground.Sage]: '📖',
  [EBackground.Sailor]: '⚓',
};

export const backgroundNames = {
  [EBackground.Acolyte]: 'Acolyte',
  [EBackground.Charlatan]: 'Charlatan',
  [EBackground.Criminal]: 'Criminal',
  [EBackground.Entertainer]: 'Entertainer',
  [EBackground.FolkHero]: 'Folk Hero',
  [EBackground.GuildArtisan]: 'Guild Artisan',
  [EBackground.Hermit]: 'Hermit',
  [EBackground.Noble]: 'Noble',
  [EBackground.Outlander]: 'Outlander',
  [EBackground.Sage]: 'Sage',
  [EBackground.Sailor]: 'Sailor',
};

// Skill name mapping
export const skillNames = {
  [ESkills.Acrobatics]: 'Acrobatics',
  [ESkills.AnimalHandling]: 'Animal Handling',
  [ESkills.Arcana]: 'Arcana',
  [ESkills.Athletics]: 'Athletics',
  [ESkills.Deception]: 'Deception',
  [ESkills.History]: 'History',
  [ESkills.Insight]: 'Insight',
  [ESkills.Intimidation]: 'Intimidation',
  [ESkills.Investigation]: 'Investigation',
  [ESkills.Medicine]: 'Medicine',
  [ESkills.Nature]: 'Nature',
  [ESkills.Perception]: 'Perception',
  [ESkills.Performance]: 'Performance',
  [ESkills.Persuasion]: 'Persuasion',
  [ESkills.Religion]: 'Religion',
  [ESkills.SleightOfHand]: 'Sleight of Hand',
  [ESkills.Stealth]: 'Stealth',
  [ESkills.Survival]: 'Survival',
};

// Helper function to get background skills for a character
export const getBackgroundSkills = (background: EBackground): ESkills[] => {
  return DnD.backgroundSkills[background] || [];
};

// Helper function to check if a skill is from background
export const isBackgroundSkill = (
  skill: ESkills,
  background: EBackground
): boolean => {
  return getBackgroundSkills(background).includes(skill);
};
