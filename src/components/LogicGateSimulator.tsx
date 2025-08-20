'use client';

import React, { useState, useEffect } from 'react';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
type SimulatorMode = 'single' | 'truth-table' | 'circuit';

interface GateDefinition {
  name: GateType;
  symbol: string;
  description: string;
  inputs: number;
  operation: (inputs: boolean[]) => boolean;
}

export default function LogicGateSimulator() {
  const [mode, setMode] = useState<SimulatorMode>('single');
  const [selectedGate, setSelectedGate] = useState<GateType>('AND');
  const [inputs, setInputs] = useState<boolean[]>([false, false]);
  const [numInputs, setNumInputs] = useState(2);

  const gates: Record<GateType, GateDefinition> = {
    AND: {
      name: 'AND',
      symbol: '&',
      description: 'Output is 1 only when ALL inputs are 1',
      inputs: 2,
      operation: (inputs) => inputs.every(x => x)
    },
    OR: {
      name: 'OR',
      symbol: '≥1',
      description: 'Output is 1 when ANY input is 1',
      inputs: 2,
      operation: (inputs) => inputs.some(x => x)
    },
    NOT: {
      name: 'NOT',
      symbol: '1',
      description: 'Output is opposite of input',
      inputs: 1,
      operation: (inputs) => !inputs[0]
    },
    NAND: {
      name: 'NAND',
      symbol: '&̄',
      description: 'NOT AND - opposite of AND gate',
      inputs: 2,
      operation: (inputs) => !inputs.every(x => x)
    },
    NOR: {
      name: 'NOR',
      symbol: '≥1̄',
      description: 'NOT OR - opposite of OR gate',
      inputs: 2,
      operation: (inputs) => !inputs.some(x => x)
    },
    XOR: {
      name: 'XOR',
      symbol: '=1',
      description: 'Exclusive OR - output is 1 when inputs are different',
      inputs: 2,
      operation: (inputs) => inputs.filter(x => x).length === 1
    },
    XNOR: {
      name: 'XNOR',
      symbol: '=1̄',
      description: 'Exclusive NOR - output is 1 when inputs are same',
      inputs: 2,
      operation: (inputs) => inputs.filter(x => x).length !== 1
    }
  };

  const generateTruthTable = (gate: GateType, inputCount: number) => {
    const numRows = Math.pow(2, inputCount);
    const table = [];
    
    for (let i = 0; i < numRows; i++) {
      const inputValues = [];
      for (let j = inputCount - 1; j >= 0; j--) {
        inputValues.push(Boolean((i >> j) & 1));
      }
      const output = gates[gate].operation(inputValues);
      table.push({ inputs: inputValues, output });
    }
    
    return table;
  };

  useEffect(() => {
    const gateInputs = selectedGate === 'NOT' ? 1 : Math.max(2, numInputs);
    setInputs(Array(gateInputs).fill(false));
  }, [selectedGate, numInputs]);

  const handleInputChange = (index: number, value: boolean) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const getOutput = () => gates[selectedGate].operation(inputs);

  const renderGateSymbol = (gate: GateType, size: 'small' | 'large' = 'large') => {
    const sizeClasses = size === 'large' ? 'w-24 h-16' : 'w-16 h-10';
    const textSize = size === 'large' ? 'text-2xl' : 'text-lg';
    
    return (
      <div className={`${sizeClasses} bg-white border-2 border-gray-400 rounded-lg flex items-center justify-center ${textSize} font-mono relative`}>
        <span className="font-bold">{gates[gate].symbol}</span>
        <div className="absolute -left-2 top-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-y-1/2"></div>
        <div className="absolute -right-2 top-1/2 w-2 h-2 bg-gray-400 rounded-full transform -translate-y-1/2"></div>
        {gate.includes('N') && gate !== 'NOT' && (
          <div className="absolute -right-3 top-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full transform -translate-y-1/2"></div>
        )}
      </div>
    );
  };

  const renderSingleGateMode = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gate Selection</h3>
          
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(gates).map((gateType) => (
              <button
                key={gateType}
                onClick={() => setSelectedGate(gateType as GateType)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedGate === gateType
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                    {gateType}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {gates[gateType as GateType].symbol}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {selectedGate !== 'NOT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Inputs: {numInputs}
              </label>
              <input
                type="range"
                min="2"
                max="4"
                value={numInputs}
                onChange={(e) => setNumInputs(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 dark:text-gray-300">Inputs:</h4>
            {inputs.map((input, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-mono w-8">
                  {String.fromCharCode(65 + index)}:
                </span>
                <button
                  onClick={() => handleInputChange(index, !input)}
                  className={`w-12 h-8 rounded-md font-mono font-bold transition-colors ${
                    input
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {input ? '1' : '0'}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {input ? 'HIGH' : 'LOW'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gate Simulation</h3>
          
          <div className="text-center space-y-4">
            {renderGateSymbol(selectedGate)}
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {gates[selectedGate].description}
            </div>
            
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Output
              </div>
              <div className={`inline-block px-6 py-3 rounded-lg font-mono text-2xl font-bold ${
                getOutput()
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {getOutput() ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {getOutput() ? 'HIGH' : 'LOW'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTruthTableMode = () => {
    const inputCount = selectedGate === 'NOT' ? 1 : numInputs;
    const truthTable = generateTruthTable(selectedGate, inputCount);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Truth Table for {selectedGate} Gate
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Gate:
              </label>
              <select
                value={selectedGate}
                onChange={(e) => setSelectedGate(e.target.value as GateType)}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.keys(gates).map((gate) => (
                  <option key={gate} value={gate}>{gate}</option>
                ))}
              </select>
            </div>
            {selectedGate !== 'NOT' && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inputs:
                </label>
                <select
                  value={numInputs}
                  onChange={(e) => setNumInputs(parseInt(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {Array.from({ length: inputCount }, (_, i) => (
                  <th key={i} className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    {String.fromCharCode(65 + i)}
                  </th>
                ))}
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Output ({selectedGate})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {truthTable.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.inputs.map((input, inputIndex) => (
                    <td key={inputIndex} className="px-4 py-2 font-mono text-lg">
                      <span className={`inline-block w-8 h-8 rounded text-center leading-8 ${
                        input ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {input ? '1' : '0'}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-2 font-mono text-lg">
                    <span className={`inline-block w-8 h-8 rounded text-center leading-8 font-bold ${
                      row.output ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {row.output ? '1' : '0'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Truth Table Analysis:
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <div>• Total combinations: {truthTable.length}</div>
            <div>• Output HIGH: {truthTable.filter(row => row.output).length} times</div>
            <div>• Output LOW: {truthTable.filter(row => !row.output).length} times</div>
            <div>• Gate function: {gates[selectedGate].description}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuickTestMode = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Gate Test
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Test different input combinations quickly
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.keys(gates).map((gateType) => {
            const gate = gates[gateType as GateType];
            const testInputs = gate.inputs === 1 ? [true] : [true, false];
            const output = gate.operation(testInputs);
            
            return (
              <div
                key={gateType}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
              >
                <div className="mb-3">
                  {renderGateSymbol(gateType as GateType, 'small')}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {gateType}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Input: {testInputs.join(', ')}
                </div>
                <div className={`text-lg font-bold ${
                  output ? 'text-green-600' : 'text-red-600'
                }`}>
                  Output: {output ? '1' : '0'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Quick Test Results:
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <div>• All gates tested with sample inputs</div>
            <div>• Use "Single Gate" mode for interactive testing</div>
            <div>• Use "Circuit Builder" tab for complex circuits</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex space-x-1">
          <button
            onClick={() => setMode('single')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'single'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Single Gate
          </button>
          <button
            onClick={() => setMode('truth-table')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'truth-table'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Truth Table
          </button>
          <button
            onClick={() => setMode('circuit')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'circuit'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Quick Test
          </button>
        </div>
      </div>

      {mode === 'single' && renderSingleGateMode()}
      {mode === 'truth-table' && renderTruthTableMode()}
      {mode === 'circuit' && renderQuickTestMode()}
      
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
        <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">
          Educational Notes:
        </h4>
        <ul className="text-sm text-green-800 dark:text-green-300 space-y-1">
          <li>• Logic gates are the building blocks of all digital circuits</li>
          <li>• AND gates are used in multiplication circuits</li>
          <li>• OR gates are used in addition circuits</li>
          <li>• XOR gates are essential for binary addition and error detection</li>
          <li>• NAND and NOR are "universal gates" - any circuit can be built with just one type</li>
          <li>• These gates directly implement Boolean algebra in hardware</li>
        </ul>
      </div>
    </div>
  );
}