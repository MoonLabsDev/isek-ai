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
