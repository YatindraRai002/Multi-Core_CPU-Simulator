'use client';

import { useState } from 'react';
import BinaryConverter from '@/components/BinaryConverter';
import LogicGateSimulator from '@/components/LogicGateSimulator';
import BinaryLogicOperations from '@/components/BinaryLogicOperations';

type ActiveTool = 'converter' | 'logic' | 'operations';

export default function Home() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('converter');

  const tools = [
    { id: 'converter', name: 'Number Converter', icon: '🔢' },
    { id: 'logic', name: 'Logic Gate Simulator', icon: '🚪' },
    { id: 'operations', name: 'Binary Logic Operations', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Digital Logic & Number Systems Lab
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Interactive tools for Computer Organization and Architecture
          </p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as ActiveTool)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  activeTool === tool.id
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="transition-opacity duration-300">
          {activeTool === 'converter' && <BinaryConverter />}
          {activeTool === 'logic' && <LogicGateSimulator />}
          {activeTool === 'operations' && <BinaryLogicOperations />}
        </div>
      </div>
    </div>
  );
}
