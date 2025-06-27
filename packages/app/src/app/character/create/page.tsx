'use client';

import { useApi } from '@/contexts/ApiContext';
import {
  backgroundIcons,
  backgroundNames,
  classIcons,
  classNames,
  raceIcons,
  raceNames,
  skillNames,
} from '@/utils/game';
import {
  DnD,
  EBackground,
  EClass,
  ERace,
  ESkills,
} from '@moonlabs/isek-ai-core/src/lib/games/DnD';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CharacterForm {
  name: string;
  description: string;
  race: ERace;
  class: EClass;
  background: EBackground;
  stats: Record<string, number>;
  selectedSkills: ESkills[];
}

const CreateCharacter = () => {
  const router = useRouter();
  const { api } = useApi();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<CharacterForm>({
    name: '',
    description: '',
    race: ERace.Human,
    class: EClass.Fighter,
    background: EBackground.FolkHero,
    stats: {
      strength: DnD.baseStat,
      dexterity: DnD.baseStat,
      constitution: DnD.baseStat,
      intelligence: DnD.baseStat,
      wisdom: DnD.baseStat,
      charisma: DnD.baseStat,
    },
    selectedSkills: [],
  });

  const [loading, setLoading] = useState(false);

  const totalSteps = 4;
  const availableSkillPoints =
    DnD.skillPoints[form.class.toLowerCase() as keyof typeof DnD.skillPoints] ||
    2;
  const usedSkillPoints = form.selectedSkills.length;
  const remainingSkillPoints = availableSkillPoints - usedSkillPoints;

  const totalStatPoints = Object.values(form.stats).reduce(
    (acc, stat) => acc + (stat - DnD.baseStat),
    0
  );
  const remainingStatPoints = DnD.inititialStatPoints - totalStatPoints;

  const availableSkills = DnD.classProficiencies[form.class] || [];
  const backgroundSkills = DnD.backgroundSkills[form.background] || [];
  const allAvailableSkills = [
    ...new Set([...availableSkills, ...backgroundSkills]),
  ];

  // Remove duplicate skills (Perception appears twice in the enum)
  const uniqueSkills = Object.values(ESkills).filter(
    (skill, index, arr) => arr.findIndex(s => s === skill) === index
  );

  const updateForm = (updates: Partial<CharacterForm>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const updateStat = (stat: string, value: number) => {
    const newStats = { ...form.stats, [stat]: value };
    updateForm({ stats: newStats });
  };

  const toggleSkill = (skill: ESkills) => {
    if (form.selectedSkills.includes(skill)) {
      updateForm({
        selectedSkills: form.selectedSkills.filter(s => s !== skill),
      });
    } else if (remainingSkillPoints > 0) {
      updateForm({ selectedSkills: [...form.selectedSkills, skill] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const characterData = {
        name: form.name,
        description: form.description,
        worldId: 'default', // You might want to make this selectable
        level: 1,
        experience: 0,
        race: form.race,
        class: form.class,
        background: form.background,
        stats: form.stats,
        skills: Object.fromEntries(
          uniqueSkills.map(skill => [
            skill,
            form.selectedSkills.includes(skill) ? 1 : 0,
          ])
        ),
        equipment: {},
      };

      const response = await api.createCharacter(characterData);

      if (response.success && response.data) {
        router.push(`/character/${response.data.character.id}`);
      } else {
        alert(
          'Failed to create character: ' + (response.error || 'Unknown error')
        );
      }
    } catch (error) {
      alert('Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.name.trim() && form.description.trim();
      case 2:
        return form.race && form.class && form.background;
      case 3:
        return remainingStatPoints === 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Create Your Character
          </h1>
          <p className="text-xl text-gray-300">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {['Basic Info', 'Race & Class', 'Ability Scores', 'Skills'].map(
              (step, index) => (
                <div
                  key={step}
                  className={`text-sm font-medium ${
                    index + 1 <= currentStep ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {step}
                </div>
              )
            )}
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Basic Information
              </h2>

              <div>
                <label className="block text-white font-medium mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => updateForm({ name: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Enter your character's name"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => updateForm({ description: e.target.value })}
                  rows={4}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Describe your character's appearance, personality, and backstory..."
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Race, Class & Background
              </h2>

              <div className="space-y-6">
                {/* Race Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Race
                  </label>
                  <select
                    value={form.race}
                    onChange={e =>
                      updateForm({ race: e.target.value as ERace })
                    }
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {Object.values(ERace).map(race => (
                      <option key={race} value={race} className="bg-slate-800">
                        {raceIcons[race]} {raceNames[race]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Class
                  </label>
                  <select
                    value={form.class}
                    onChange={e => {
                      updateForm({
                        class: e.target.value as EClass,
                        selectedSkills: [],
                      });
                    }}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {Object.values(EClass).map(classType => (
                      <option
                        key={classType}
                        value={classType}
                        className="bg-slate-800"
                      >
                        {classIcons[classType]} {classNames[classType]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">
                    Background
                  </label>
                  <select
                    value={form.background}
                    onChange={e =>
                      updateForm({
                        background: e.target.value as EBackground,
                      })
                    }
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {Object.values(EBackground).map(background => (
                      <option
                        key={background}
                        value={background}
                        className="bg-slate-800"
                      >
                        {backgroundIcons[background]}{' '}
                        {backgroundNames[background]}
                      </option>
                    ))}
                  </select>

                  {/* Background Skills Preview */}
                  {backgroundSkills.length > 0 && (
                    <div className="mt-3">
                      <div className="text-gray-300 text-sm mb-2">
                        Background Skills:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {backgroundSkills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                          >
                            {skillNames[skill]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Ability Scores
              </h2>

              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="text-center text-white">
                  <span className="text-lg font-semibold">
                    Remaining Points:{' '}
                  </span>
                  <span
                    className={`text-2xl font-bold ${remainingStatPoints < 0 ? 'text-red-400' : 'text-green-400'}`}
                  >
                    {remainingStatPoints}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(form.stats).map(([stat, value]) => (
                  <div key={stat} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-white font-medium capitalize">
                        {stat}
                      </label>
                      <div className="text-right">
                        <div className="text-white font-bold text-lg">
                          {value}
                        </div>
                        <div className="text-gray-400 text-sm">
                          Modifier:{' '}
                          {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}
                          {Math.floor((value - 10) / 2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateStat(stat, Math.max(DnD.baseStat, value - 1))
                        }
                        className="w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 bg-white/10 rounded h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded"
                          style={{
                            width: `${((value - DnD.baseStat) / (18 - DnD.baseStat)) * 100}%`,
                          }}
                        />
                      </div>
                      <button
                        onClick={() =>
                          updateStat(stat, Math.min(18, value + 1))
                        }
                        className="w-8 h-8 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Skill Proficiencies
              </h2>

              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="text-center text-white">
                  <span className="text-lg font-semibold">
                    Skill Points Remaining:{' '}
                  </span>
                  <span
                    className={`text-2xl font-bold ${remainingSkillPoints < 0 ? 'text-red-400' : 'text-green-400'}`}
                  >
                    {remainingSkillPoints}
                  </span>
                  <div className="text-sm text-gray-400 mt-1">
                    {availableSkillPoints} total points available for{' '}
                    {form.class}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {uniqueSkills.map(skill => {
                  const isSelected = form.selectedSkills.includes(skill);
                  const isAvailable = allAvailableSkills.includes(skill);
                  const isBackgroundSkill = backgroundSkills.includes(skill);
                  const abilityScore = DnD.skillStats[skill];
                  const abilityValue = form.stats[abilityScore];
                  const modifier = Math.floor((abilityValue - 10) / 2);
                  const modifierText =
                    modifier >= 0 ? `+${modifier}` : `${modifier}`;

                  return (
                    <div
                      key={skill}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50'
                          : isBackgroundSkill
                            ? 'bg-blue-500/10 border-blue-500/30'
                            : isAvailable
                              ? 'bg-white/5 border-white/20 hover:bg-white/10'
                              : 'bg-gray-500/10 border-gray-500/30 opacity-50 cursor-not-allowed invisible hidden'
                      }`}
                      onClick={() => isAvailable && toggleSkill(skill)}
                    >
                      <div className="space-y-2">
                        <div className="text-white font-medium">
                          {skillNames[skill]}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-gray-600/50 text-gray-300 text-xs rounded-full border border-gray-500/30">
                            {abilityScore.charAt(0).toUpperCase() +
                              abilityScore.slice(1)}{' '}
                            {modifierText}
                          </span>
                          {isBackgroundSkill && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                              Background +2
                            </span>
                          )}
                          {isSelected && (
                            <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full">
                              Proficient +2
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Character'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCharacter;
