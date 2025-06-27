'use client';

import Link from 'next/link';
import { useState } from 'react';

const Page = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cards = [
    {
      id: 'world-creation',
      title: 'World Creation',
      description:
        'Craft your own unique fantasy world with rich lore, diverse landscapes, and compelling history.',
      icon: '🌍',
      color: 'from-purple-500 to-indigo-600',
      hoverColor: 'from-purple-600 to-indigo-700',
      link: '/world/create',
    },
    {
      id: 'character-creation',
      title: 'Character Creation',
      description:
        'Design and develop your protagonist with detailed backstory, personality, and abilities.',
      icon: '⚔️',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'from-emerald-600 to-teal-700',
      link: '/character/create',
    },
  ];

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              IsekAI
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Embark on an epic journey through AI-powered fantasy worlds. Choose
            your path and begin your adventure.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cards.map(card => (
            <Link
              key={card.id}
              href={card.link}
              className="group block"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`
                relative overflow-hidden rounded-2xl p-8 h-80
                bg-gradient-to-br ${card.color}
                transform transition-all duration-300 ease-out
                ${
                  hoveredCard === card.id
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
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Icon and Title */}
                  <div className="text-center">
                    <div className="text-6xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                      {card.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {card.title}
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-white/90 leading-relaxed text-center">
                    {card.description}
                  </p>

                  {/* CTA Button */}
                  <div className="text-center mt-6">
                    <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold transition-all duration-300 group-hover:bg-white/30 group-hover:scale-105">
                      Start Creating
                      <svg
                        className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div
                  className={`
                  absolute inset-0 bg-gradient-to-br ${card.hoverColor} opacity-0
                  transition-opacity duration-300 ease-out
                  ${hoveredCard === card.id ? 'opacity-100' : 'opacity-0'}
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
