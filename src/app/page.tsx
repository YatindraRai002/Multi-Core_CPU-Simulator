'use client';

import { useState } from 'react';
import BinaryConverter from '@/components/BinaryConverter';
import LogicGateSimulator from '@/components/LogicGateSimulator';
import BinaryLogicOperations from '@/components/BinaryLogicOperations';

type ActiveTool = 'converter' | 'logic' | 'operations' | 'circuit';

function ComingSoonPlaceholder() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse">
          <span className="text-4xl">🔧</span>
        </div>
      </div>
      
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        Circuit Builder
      </h2>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        Coming Soon
      </p>
      
      <div className="space-y-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        <p className="text-lg">
          An advanced interactive circuit design tool is in development!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
              🎯 Planned Features
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1 text-left">
              <li>• Drag & drop circuit design</li>
              <li>• Real-time signal simulation</li>
              <li>• Logic gate connections</li>
              <li>• Circuit analysis tools</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
              ⚡ Current Tools
            </h3>
            <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-1 text-left">
              <li>• Use Logic Gate Simulator for individual gates</li>
              <li>• Try Binary Logic Operations for bit manipulation</li>
              <li>• Explore Number Converter for base conversions</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Stay tuned for updates! 🚀
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('converter');

  const tools = [
    { id: 'converter', name: 'Number Converter', icon: '🔢', description: 'Convert between number systems' },
    { id: 'logic', name: 'Logic Gate Simulator', icon: '🚪', description: 'Simulate individual logic gates' },
    { id: 'operations', name: 'Binary Logic Operations', icon: '⚡', description: 'Bitwise operations visualizer' },
    { id: 'circuit', name: 'Circuit Builder', icon: '🔧', description: 'Coming soon - Advanced circuit design' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="container mx-auto max-w-7xl">
        <header className="text-center mb-8 pt-8">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-2xl">💾</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Digital Logic & Number Systems Lab
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Interactive tools for Computer Organization and Architecture
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Build circuits, simulate logic gates, and explore digital systems
          </p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl p-3 border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id as ActiveTool)}
                  className={`group relative p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 ${
                    activeTool === tool.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : tool.id === 'circuit'
                      ? 'bg-gray-100 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500 cursor-pointer opacity-75'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <div className="font-medium text-sm mb-1">{tool.name}</div>
                  <div className={`text-xs opacity-75 ${
                    activeTool === tool.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {tool.description}
                  </div>
                  {activeTool === tool.id && (
                    <div className="absolute inset-0 rounded-xl ring-2 ring-blue-400 ring-opacity-75 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="transition-all duration-500 transform">
          <div className="animate-fade-in">
            {activeTool === 'converter' && <BinaryConverter />}
            {activeTool === 'logic' && <LogicGateSimulator />}
            {activeTool === 'operations' && <BinaryLogicOperations />}
            {activeTool === 'circuit' && <ComingSoonPlaceholder />}
          </div>
        </div>
      </div>
    </div>
  );
}
