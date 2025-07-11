'use client';

import Link from 'next/link';
import { useState } from 'react';

const Page = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      id: 1,
      title: 'Create a Character',
      description:
        'Design your protagonist with detailed backstory, personality, and abilities.',
      icon: '⚔️',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
      link: '/character/create',
      status: 'ready',
    },
    {
      id: 2,
      title: 'Create or Select a World',
      description:
        'Craft your own unique fantasy world or choose from existing ones.',
      icon: '🌍',
      color: 'from-purple-500 to-indigo-600',
      hoverColor: 'from-purple-600 to-indigo-700',
      link: '/world',
      status: 'ready',
    },
    {
      id: 3,
      title: 'Start a Campaign',
      description:
        'Begin your adventure solo or invite friends to join your journey.',
      icon: '🎭',
      color: 'from-orange-500 to-red-600',
      hoverColor: 'from-orange-600 to-red-700',
      link: '/game',
      status: 'ready',
    },
  ];

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              IsekAI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Embark on an epic journey through AI-powered fantasy worlds. Follow
            these steps to begin your adventure.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map(step => (
            <Link
              key={step.id}
              href={step.link}
              className="group block"
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div
                className={`
                relative overflow-hidden rounded-2xl p-6 h-64
                bg-gradient-to-br ${step.color}
                transform transition-all duration-300 ease-out
                ${
                  hoveredStep === step.id
                    ? 'scale-105 shadow-2xl shadow-black/30'
                    : 'scale-100 shadow-xl shadow-black/20'
                }
                hover:shadow-2xl hover:shadow-black/30
              `}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center text-center">
                  {/* Icon */}
                  <div className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br ${step.hoverColor} opacity-0
                  transition-opacity duration-300 ease-out
                  ${hoveredStep === step.id ? 'opacity-100' : 'opacity-0'}
                `}
                ></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
