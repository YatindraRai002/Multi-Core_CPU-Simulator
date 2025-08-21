'use client';

import React, { useState, useEffect } from 'react';

type LogicOperation = 'AND' | 'OR' | 'XOR' | 'NOT' | 'NAND' | 'NOR';

interface OperationResult {
  binary: string;
  decimal: number;
  hex: string;
}

export default function BinaryLogicOperations() {
  const [inputA, setInputA] = useState('1101');
  const [inputB, setInputB] = useState('1010');
  const [operation, setOperation] = useState<LogicOperation>('AND');
  const [bitWidth, setBitWidth] = useState(8);
  const [result, setResult] = useState<OperationResult>({ binary: '', decimal: 0, hex: '' });

  const operations = {
    AND: { description: 'Bitwise AND - Both bits must be 1' },
    OR: { description: 'Bitwise OR - Either bit can be 1' },
    XOR: {  description: 'Bitwise XOR - Bits must be different' },
    NOT: {  description: 'Bitwise NOT - Inverts all bits' },
    NAND: {  description: 'Bitwise NAND - NOT AND' },
    NOR: { description: 'Bitwise NOR - NOT OR' }
  };

  const performOperation = (binA: string, binB: string, op: LogicOperation, width: number): OperationResult => {
    const padA = binA.padStart(width, '0').slice(-width);
    const padB = binB.padStart(width, '0').slice(-width);
    
    let resultBinary = '';
    
    for (let i = 0; i < width; i++) {
      const bitA = padA[i] === '1';
      const bitB = padB[i] === '1';
      let resultBit: boolean;
      
      switch (op) {
        case 'AND':
          resultBit = bitA && bitB;
          break;
        case 'OR':
          resultBit = bitA || bitB;
          break;
        case 'XOR':
          resultBit = bitA !== bitB;
          break;
        case 'NOT':
          resultBit = !bitA;
          break;
        case 'NAND':
          resultBit = !(bitA && bitB);
          break;
        case 'NOR':
          resultBit = !(bitA || bitB);
          break;
        default:
          resultBit = false;
      }
      
      resultBinary += resultBit ? '1' : '0';
    }
    
    const decimal = parseInt(resultBinary, 2);
    const hex = decimal.toString(16).toUpperCase().padStart(Math.ceil(width / 4), '0');
    
    return { binary: resultBinary, decimal, hex };
  };

  useEffect(() => {
    try {
      const binaryA = parseInt(inputA, 2).toString(2);
      const binaryB = parseInt(inputB, 2).toString(2);
      const newResult = performOperation(binaryA, binaryB, operation, bitWidth);
      setResult(newResult);
    } catch (error) {
      setResult({ binary: ''.padStart(bitWidth, '0'), decimal: 0, hex: '0' });
    }
  }, [inputA, inputB, operation, bitWidth]);

  const formatBinaryWithSpaces = (binary: string): string => {
    return binary.replace(/(.{4})/g, '$1 ').trim();
  };

  const renderBitComparison = (): JSX.Element => {
    const padA = inputA.padStart(bitWidth, '0').slice(-bitWidth);
    const padB = inputB.padStart(bitWidth, '0').slice(-bitWidth);
    const resultBin = result.binary;

    return (
      <div className="space-y-2">
        <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Bit-by-bit {operation} Operation
        </div>
        
        {/* Bit positions */}
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${bitWidth}, 1fr)` }}>
          {Array.from({ length: bitWidth }, (_, i) => (
            <div key={i} className="text-center text-xs text-gray-500 dark:text-gray-400">
              {bitWidth - 1 - i}
            </div>
          ))}
        </div>

        {/* Input A */}
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${bitWidth}, 1fr)` }}>
          {padA.split('').map((bit, i) => (
            <div key={i} className={`text-center p-2 rounded text-sm font-mono border ${
              bit === '1' 
                ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200' 
                : 'bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
            }`}>
              {bit}
            </div>
          ))}
        </div>

        {/* Operation symbol */}
        <div className="text-center py-2">
          <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
            {operations[operation].symbol}
          </span>
        </div>

        {/* Input B (if not NOT operation) */}
        {operation !== 'NOT' && (
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${bitWidth}, 1fr)` }}>
            {padB.split('').map((bit, i) => (
              <div key={i} className={`text-center p-2 rounded text-sm font-mono border ${
                bit === '1' 
                  ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200' 
                  : 'bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              }`}>
                {bit}
              </div>
            ))}
          </div>
        )}

        {/* Equals line */}
        <div className="text-center py-1">
          <hr className="border-t-2 border-gray-400" />
        </div>

        {/* Result */}
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${bitWidth}, 1fr)` }}>
          {resultBin.split('').map((bit, i) => (
            <div key={i} className={`text-center p-2 rounded text-sm font-mono border-2 ${
              bit === '1' 
                ? 'bg-orange-100 border-orange-400 text-orange-800 dark:bg-orange-900 dark:border-orange-500 dark:text-orange-200' 
                : 'bg-gray-100 border-gray-400 text-gray-600 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300'
            }`}>
              {bit}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApplicationExamples = (): JSX.Element => {
    const examples = {
      AND: [
        'Masking bits: Use to isolate specific bits (e.g., 1101 & 0011 = 0001)',
        'Hardware: Used in multiplication circuits and conditional operations'
      ],
      OR: [
        'Setting bits: Use to turn on specific bits (e.g., 1101 | 0010 = 1111)',
        'Hardware: Used in addition circuits and flag operations'
      ],
      XOR: [
        'Toggling bits: Use to flip specific bits (e.g., 1101 ^ 0011 = 1110)',
        'Hardware: Essential for binary addition and error detection/correction'
      ],
      NOT: [
        'Inverting: Use to flip all bits (e.g., ~1101 = 0010 in 4-bit)',
        'Hardware: Used in complement operations and logic circuit inversions'
      ],
      NAND: [
        'Universal gate: Can implement any Boolean function',
        'Hardware: Building block for many complex circuits'
      ],
      NOR: [
        'Universal gate: Alternative to NAND for implementing any function',
        'Hardware: Used in memory cells and flip-flop circuits'
      ]
    };

    return (
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
        <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-3">
          Real-world Applications of {operation}:
        </h4>
        <ul className="text-sm text-purple-800 dark:text-purple-300 space-y-2">
          {examples[operation].map((example, index) => (
            <li key={index}>• {example}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Binary Logic Operations
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          See how logic gates process binary data bit-by-bit
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inputs</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bit Width
              </label>
              <select
                value={bitWidth}
                onChange={(e) => setBitWidth(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={4}>4-bit</option>
                <option value={8}>8-bit</option>
                <option value={16}>16-bit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Operation
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value as LogicOperation)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.entries(operations).map(([op, info]) => (
                  <option key={op} value={op}>{op} ({info.symbol})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Binary A
              </label>
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value.replace(/[^01]/g, ''))}
                placeholder="Enter binary number..."
                className="w-full p-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {operation !== 'NOT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Binary B
                </label>
                <input
                  type="text"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value.replace(/[^01]/g, ''))}
                  placeholder="Enter binary number..."
                  className="w-full p-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {operations[operation].description}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Result</h3>
          
          <div className="grid gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Binary Result
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                {formatBinaryWithSpaces(result.binary)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Decimal Result
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                {result.decimal}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hexadecimal Result
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                0x{result.hex}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual bit-by-bit operation */}
      <div className="border-t pt-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          {renderBitComparison()}
        </div>
      </div>

      {/* Application examples */}
      {renderApplicationExamples()}

      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md">
        <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
          ALU Connection:
        </h4>
        <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-1">
          <li>• These operations are performed by the ALU (Arithmetic Logic Unit) in your CPU</li>
          <li>• Each operation happens in parallel across all bits simultaneously</li>
          <li>• Modern processors can perform these operations on 64-bit numbers in a single cycle</li>
          <li>• Understanding these operations helps you optimize code performance</li>
        </ul>
      </div>
    </div>
  );
}
