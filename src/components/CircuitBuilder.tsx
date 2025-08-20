'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'INPUT' | 'OUTPUT';

interface Position {
  x: number;
  y: number;
}

interface GateComponent {
  id: string;
  type: GateType;
  position: Position;
  inputs: string[];
  output: string | null;
  value?: boolean;
  label?: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
}

interface CircuitState {
  gates: GateComponent[];
  connections: Connection[];
  inputValues: Record<string, boolean>;
}

const GATE_COLORS = {
  AND: 'bg-blue-500',
  OR: 'bg-green-500',
  NOT: 'bg-red-500',
  NAND: 'bg-purple-500',
  NOR: 'bg-orange-500',
  XOR: 'bg-pink-500',
  XNOR: 'bg-indigo-500',
  INPUT: 'bg-gray-600',
  OUTPUT: 'bg-yellow-600'
};

const GATE_SYMBOLS = {
  AND: '&',
  OR: '≥1',
  NOT: '1',
  NAND: '&̄',
  NOR: '≥1̄',
  XOR: '=1',
  XNOR: '=1̄',
  INPUT: 'IN',
  OUTPUT: 'OUT'
};

export default function CircuitBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [circuit, setCircuit] = useState<CircuitState>({
    gates: [],
    connections: [],
    inputValues: {}
  });
  const [selectedGateType, setSelectedGateType] = useState<GateType>('AND');
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{gateId: string, port: string} | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [gateOutputs, setGateOutputs] = useState<Record<string, boolean>>({});

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addGate = useCallback((type: GateType, position: Position) => {
    const newGate: GateComponent = {
      id: generateId(),
      type,
      position,
      inputs: type === 'INPUT' || type === 'OUTPUT' ? [] : (type === 'NOT' ? ['input'] : ['input1', 'input2']),
      output: type === 'OUTPUT' ? null : 'output',
      value: type === 'INPUT' ? false : undefined,
      label: type === 'INPUT' ? 'Input' : type === 'OUTPUT' ? 'Output' : undefined
    };

    setCircuit(prev => ({
      ...prev,
      gates: [...prev.gates, newGate],
      inputValues: type === 'INPUT' ? { ...prev.inputValues, [newGate.id]: false } : prev.inputValues
    }));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
      } else {
        addGate(selectedGateType, position);
      }
    }
  }, [selectedGateType, addGate, isConnecting]);

  const handleGateMouseDown = useCallback((e: React.MouseEvent, gateId: string) => {
    e.stopPropagation();
    const gate = circuit.gates.find(g => g.id === gateId);
    if (gate) {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - gate.position.x,
        y: e.clientY - gate.position.y
      });
      setDraggedGate(gateId);
    }
  }, [circuit.gates]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedGate && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: e.clientX - rect.left - dragOffset.x,
        y: e.clientY - rect.top - dragOffset.y
      };

      setCircuit(prev => ({
        ...prev,
        gates: prev.gates.map(gate =>
          gate.id === draggedGate
            ? { ...gate, position: newPosition }
            : gate
        )
      }));
    }
  }, [draggedGate, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedGate(null);
  }, []);

  const handleConnectionStart = useCallback((gateId: string, port: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnecting(true);
    setConnectionStart({ gateId, port });
  }, []);

  const handleConnectionEnd = useCallback((gateId: string, port: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connectionStart && connectionStart.gateId !== gateId) {
      const newConnection: Connection = {
        id: generateId(),
        from: connectionStart.gateId,
        to: gateId,
        fromPort: connectionStart.port,
        toPort: port
      };

      setCircuit(prev => ({
        ...prev,
        connections: [...prev.connections, newConnection]
      }));
    }
    setIsConnecting(false);
    setConnectionStart(null);
  }, [connectionStart]);

  const deleteGate = useCallback((gateId: string) => {
    setCircuit(prev => ({
      ...prev,
      gates: prev.gates.filter(g => g.id !== gateId),
      connections: prev.connections.filter(c => c.from !== gateId && c.to !== gateId),
      inputValues: prev.inputValues
    }));
  }, []);

  const toggleInputValue = useCallback((gateId: string) => {
    setCircuit(prev => ({
      ...prev,
      inputValues: {
        ...prev.inputValues,
        [gateId]: !prev.inputValues[gateId]
      }
    }));
  }, []);

  const simulateCircuit = useCallback(() => {
    const outputs: Record<string, boolean> = { ...circuit.inputValues };
    
    const calculateGateOutput = (gate: GateComponent): boolean => {
      if (gate.type === 'INPUT') {
        return circuit.inputValues[gate.id] || false;
      }

      const inputConnections = circuit.connections.filter(c => c.to === gate.id);
      const inputValues = inputConnections.map(conn => {
        const sourceGate = circuit.gates.find(g => g.id === conn.from);
        return sourceGate ? outputs[conn.from] : false;
      });

      switch (gate.type) {
        case 'AND':
          return inputValues.length === 2 ? inputValues[0] && inputValues[1] : false;
        case 'OR':
          return inputValues.length === 2 ? inputValues[0] || inputValues[1] : false;
        case 'NOT':
          return inputValues.length === 1 ? !inputValues[0] : false;
        case 'NAND':
          return inputValues.length === 2 ? !(inputValues[0] && inputValues[1]) : false;
        case 'NOR':
          return inputValues.length === 2 ? !(inputValues[0] || inputValues[1]) : false;
        case 'XOR':
          return inputValues.length === 2 ? inputValues[0] !== inputValues[1] : false;
        case 'XNOR':
          return inputValues.length === 2 ? inputValues[0] === inputValues[1] : false;
        default:
          return false;
      }
    };

    // Calculate outputs for all gates
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const gate of circuit.gates) {
        if (gate.type !== 'OUTPUT') {
          const newOutput = calculateGateOutput(gate);
          if (outputs[gate.id] !== newOutput) {
            outputs[gate.id] = newOutput;
            changed = true;
          }
        }
      }
    }

    setGateOutputs(outputs);
  }, [circuit]);

  useEffect(() => {
    if (simulationRunning) {
      simulateCircuit();
    }
  }, [circuit.inputValues, circuit.connections, simulationRunning, simulateCircuit]);

  const clearCircuit = () => {
    setCircuit({
      gates: [],
      connections: [],
      inputValues: {}
    });
    setGateOutputs({});
  };

  const renderGate = (gate: GateComponent) => {
    const isActive = simulationRunning && (gateOutputs[gate.id] || gate.type === 'INPUT' && circuit.inputValues[gate.id]);
    
    return (
      <div
        key={gate.id}
        className={`absolute select-none cursor-move rounded-lg shadow-lg border-2 ${
          GATE_COLORS[gate.type]
        } ${isActive ? 'ring-4 ring-yellow-400' : ''} transition-all duration-200`}
        style={{
          left: gate.position.x - 40,
          top: gate.position.y - 30,
          width: 80,
          height: 60
        }}
        onMouseDown={(e) => handleGateMouseDown(e, gate.id)}
      >
        <div className="flex flex-col items-center justify-center h-full text-white font-bold">
          <div className="text-lg">{GATE_SYMBOLS[gate.type]}</div>
          <div className="text-xs">{gate.type}</div>
        </div>

        {/* Input connection points */}
        {gate.inputs.map((input, index) => (
          <div
            key={input}
            className="absolute w-3 h-3 bg-gray-300 rounded-full border border-gray-500 cursor-pointer hover:bg-gray-200"
            style={{
              left: -6,
              top: gate.type === 'NOT' ? 24 : 15 + index * 30
            }}
            onClick={(e) => handleConnectionEnd(gate.id, input, e)}
          />
        ))}

        {/* Output connection point */}
        {gate.output && (
          <div
            className="absolute w-3 h-3 bg-gray-300 rounded-full border border-gray-500 cursor-pointer hover:bg-gray-200"
            style={{
              right: -6,
              top: 24
            }}
            onClick={(e) => handleConnectionStart(gate.id, gate.output, e)}
          />
        )}

        {/* Input toggle for INPUT gates */}
        {gate.type === 'INPUT' && (
          <button
            className={`absolute top-1 right-1 w-4 h-4 rounded-full text-xs font-bold ${
              circuit.inputValues[gate.id] ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleInputValue(gate.id);
            }}
          >
            {circuit.inputValues[gate.id] ? '1' : '0'}
          </button>
        )}

        {/* Delete button */}
        <button
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            deleteGate(gate.id);
          }}
        >
          ×
        </button>
      </div>
    );
  };

  const renderConnections = () => {
    return circuit.connections.map(connection => {
      const fromGate = circuit.gates.find(g => g.id === connection.from);
      const toGate = circuit.gates.find(g => g.id === connection.to);
      
      if (!fromGate || !toGate) return null;

      const fromX = fromGate.position.x + 40;
      const fromY = fromGate.position.y;
      const toX = toGate.position.x - 40;
      const toY = toGate.position.y;

      const isActive = simulationRunning && gateOutputs[fromGate.id];

      return (
        <svg
          key={connection.id}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          <line
            x1={fromX}
            y1={fromY}
            x2={toX}
            y2={toY}
            stroke={isActive ? '#facc15' : '#6b7280'}
            strokeWidth={isActive ? 4 : 2}
            className="transition-all duration-200"
          />
        </svg>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(['INPUT', 'OUTPUT', 'AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'] as GateType[]).map(gateType => (
              <button
                key={gateType}
                onClick={() => setSelectedGateType(gateType)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedGateType === gateType
                    ? `${GATE_COLORS[gateType]} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {gateType}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setSimulationRunning(!simulationRunning)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                simulationRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {simulationRunning ? 'Stop Simulation' : 'Start Simulation'}
            </button>
            <button
              onClick={clearCircuit}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Selected: <span className="font-semibold">{selectedGateType}</span> • 
          Click on canvas to add gate • Drag gates to move • Click connection points to wire
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative bg-gray-50 dark:bg-gray-900 overflow-hidden"
        style={{ height: '600px' }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connections */}
        {renderConnections()}

        {/* Gates */}
        {circuit.gates.map(renderGate)}

        {/* Connection preview */}
        {isConnecting && connectionStart && (
          <div className="absolute top-0 left-0 text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
            Connecting from {connectionStart.gateId}... Click target input
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Circuit Stats</h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <div>Gates: {circuit.gates.length}</div>
              <div>Connections: {circuit.connections.length}</div>
              <div>Inputs: {circuit.gates.filter(g => g.type === 'INPUT').length}</div>
              <div>Outputs: {circuit.gates.filter(g => g.type === 'OUTPUT').length}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions</h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Select gate type from toolbar</li>
              <li>• Click canvas to place gate</li>
              <li>• Drag gates to reposition</li>
              <li>• Click connection points to wire gates</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Simulation</h4>
            <ul className="text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Toggle INPUT gates to change values</li>
              <li>• Start simulation to see signal flow</li>
              <li>• Active signals glow yellow</li>
              <li>• Build complex logic circuits!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}