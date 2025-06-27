import { Express, Request, Response } from 'express';
import { global } from '../../../../globals';
import { withLogging } from '../../../../utils/routeLogger';

const handleGetCharacterSheet = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Get character from database
  const character = await global.db.getCharacter(id);

  if (!character) {
    return res.status(404).json({
      success: false,
      error: 'Character not found',
    });
  }

  // Define skills enum locally to avoid import issues
  const ESkills = {
    Acrobatics: 'ACR',
    AnimalHandling: 'ANI',
    Arcana: 'ARC',
    Athletics: 'ATH',
    Deception: 'DEC',
    History: 'HIS',
    Insight: 'INS',
    Intimidation: 'INT',
    Investigation: 'INV',
    Medicine: 'MED',
    Nature: 'NAT',
    Perception: 'PER',
    Performance: 'PERF',
    Persuasion: 'PERS',
    Religion: 'REL',
    SleightOfHand: 'SLE',
    Stealth: 'STE',
    Survival: 'SUR',
  };

  // Calculate skill modifiers and proficiency bonuses
  const skillDetails = Object.values(ESkills).map(skill => {
    const statValue = character.stats[skill.toLowerCase()] || 10;
    const modifier = Math.floor((statValue - 10) / 2);
    const skillLevel = character.skills[skill] || 0;
    const proficiencyBonus = skillLevel > 0 ? 2 : 0; // Assuming level 1 for now
    const total = modifier + proficiencyBonus;

    return {
      name: skill,
      fullName: getSkillFullName(skill),
      statValue,
      modifier,
      proficiencyBonus,
      total,
      isProficient: skillLevel > 0,
    };
  });

  const response = {
    success: true,
    character: {
      id: character.id,
      name: character.name,
      description: character.description,
      level: character.level || 1,
      experience: character.experience || 0,
      stats: character.stats,
      skills: skillDetails,
      equipment: character.equipment || {},
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
    },
  };

  res.json(response);
};

// Helper function to get full skill names
function getSkillFullName(skillCode: string): string {
  const skillNames: Record<string, string> = {
    ACR: 'Acrobatics',
    ANI: 'Animal Handling',
    ARC: 'Arcana',
    ATH: 'Athletics',
    DEC: 'Deception',
    HIS: 'History',
    INS: 'Insight',
    INT: 'Intimidation',
    INV: 'Investigation',
    MED: 'Medicine',
    NAT: 'Nature',
    PER: 'Perception',
    PERF: 'Performance',
    PERS: 'Persuasion',
    REL: 'Religion',
    SLE: 'Sleight of Hand',
    STE: 'Stealth',
    SUR: 'Survival',
  };

  return skillNames[skillCode] || skillCode;
}

export const get_character_sheet = (app: Express) => {
  app.get(
    '/api/v1/character/sheet/:id',
    withLogging('GET', '/api/v1/character/sheet/:id', handleGetCharacterSheet)
  );
};
