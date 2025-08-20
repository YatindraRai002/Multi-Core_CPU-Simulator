'use client';

import React, { useState, useEffect } from 'react';

type NumberBase = 'binary' | 'decimal' | 'hexadecimal' | 'octal';
type BitWidth = 8 | 16 | 32 | 64;

interface ConversionResult {
  binary: string;
  decimal: string;
  hexadecimal: string;
  octal: string;
}

export default function BinaryConverter() {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState<NumberBase>('decimal');
  const [bitWidth, setBitWidth] = useState<BitWidth>(8);
  const [signedMode, setSignedMode] = useState(false);
  const [result, setResult] = useState<ConversionResult>({
    binary: '',
    decimal: '',
    hexadecimal: '',
    octal: ''
  });
  const [error, setError] = useState('');

  const convertNumber = (value: string, fromBase: NumberBase): ConversionResult | null => {
    if (!value.trim()) {
      return {
        binary: '',
        decimal: '',
        hexadecimal: '',
        octal: ''
      };
    }

    try {
      let decimalValue: number;

      switch (fromBase) {
        case 'decimal':
          decimalValue = parseInt(value, 10);
          break;
        case 'binary':
          decimalValue = parseInt(value, 2);
          break;
        case 'hexadecimal':
          decimalValue = parseInt(value, 16);
          break;
        case 'octal':
          decimalValue = parseInt(value, 8);
          break;
        default:
          throw new Error('Invalid base');
      }

      if (isNaN(decimalValue)) {
        throw new Error('Invalid number');
      }

      const maxValue = signedMode ? Math.pow(2, bitWidth - 1) - 1 : Math.pow(2, bitWidth) - 1;
      const minValue = signedMode ? -Math.pow(2, bitWidth - 1) : 0;

      if (decimalValue > maxValue || decimalValue < minValue) {
        throw new Error(`Number out of range for ${bitWidth}-bit ${signedMode ? 'signed' : 'unsigned'} integer`);
      }

      let binaryValue: string;
      if (signedMode && decimalValue < 0) {
        binaryValue = (decimalValue >>> 0).toString(2).slice(-bitWidth);
      } else {
        binaryValue = decimalValue.toString(2).padStart(bitWidth, '0');
      }

      return {
        binary: binaryValue,
        decimal: decimalValue.toString(),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
        octal: decimalValue.toString(8)
      };
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    try {
      setError('');
      const conversionResult = convertNumber(inputValue, inputBase);
      if (conversionResult) {
        setResult(conversionResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResult({
        binary: '',
        decimal: '',
        hexadecimal: '',
        octal: ''
      });
    }
  }, [inputValue, inputBase, bitWidth, signedMode]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const formatBinaryWithSpaces = (binary: string): string => {
    return binary.replace(/(.{4})/g, '$1 ').trim();
  };

  const getBitPattern = (): JSX.Element[] => {
    const bits = result.binary.padStart(bitWidth, '0').split('');
    return bits.map((bit, index) => (
      <div
        key={index}
        className={`w-8 h-8 flex items-center justify-center rounded text-sm font-mono border-2 ${
          bit === '1'
            ? 'bg-blue-500 text-white border-blue-600'
            : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
        }`}
      >
        {bit}
      </div>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Configuration</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Input Base
              </label>
              <select
                value={inputBase}
                onChange={(e) => setInputBase(e.target.value as NumberBase)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="decimal">Decimal (Base 10)</option>
                <option value="binary">Binary (Base 2)</option>
                <option value="hexadecimal">Hexadecimal (Base 16)</option>
                <option value="octal">Octal (Base 8)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bit Width
              </label>
              <select
                value={bitWidth}
                onChange={(e) => setBitWidth(parseInt(e.target.value) as BitWidth)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={8}>8-bit</option>
                <option value={16}>16-bit</option>
                <option value={32}>32-bit</option>
                <option value={64}>64-bit</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="signedMode"
                checked={signedMode}
                onChange={(e) => setSignedMode(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="signedMode" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Signed (Two's Complement)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Input Number
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Enter ${inputBase} number...`}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Conversions</h3>
          
          <div className="grid gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Binary (Base 2)
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                {result.binary ? formatBinaryWithSpaces(result.binary) : '—'}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Decimal (Base 10)
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                {result.decimal || '—'}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Hexadecimal (Base 16)
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                {result.hexadecimal ? `0x${result.hexadecimal}` : '—'}
              </div>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Octal (Base 8)
              </label>
              <div className="font-mono text-lg text-gray-900 dark:text-white">
                {result.octal ? `0${result.octal}` : '—'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {result.binary && (
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Bit Pattern Visualization
          </h3>
          <div className="grid grid-cols-8 gap-1 justify-center">
            {getBitPattern()}
          </div>
          <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {bitWidth}-bit {signedMode ? 'Signed' : 'Unsigned'} Representation
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
          Educational Notes:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Binary uses only 0s and 1s (base 2)</li>
          <li>• Decimal is our everyday number system (base 10)</li>
          <li>• Hexadecimal uses 0-9 and A-F (base 16) - common in memory addresses</li>
          <li>• Octal uses 0-7 (base 8) - sometimes used in file permissions</li>
          <li>• Two's complement allows representation of negative numbers</li>
        </ul>
      </div>
    </div>
  );
}