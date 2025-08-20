

# Digital Logic & Number Systems Laboratory



> **A modern web-based educational platform for exploring digital logic circuits, number system conversions, and binary operations. Built for students, educators and professionals in computer science and engineering.**

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Architecture](#-architecture)
3. [Features](#-features)
4. [Installation & Setup](#-installation--setup)
5. [Component Documentation](#-component-documentation)
6. [Usage Guide](#-usage-guide)
7. [Technical Specifications](#-technical-specifications)
8. [Development Guide](#-development-guide)
9. [Contributing](#-contributing)
10. [Roadmap](#-project-roadmap)

---

## 🎯 Overview

The **Digital Logic & Number Systems Laboratory** is an interactive web application that enables learners to visualize and experiment with core computer organization concepts. It integrates multiple modules for **number systems, digital logic, and binary operations**, helping users build a solid foundation in digital system design.

### 🎓 Educational Objectives

* Explore number systems: **Binary, Decimal, Hexadecimal, Octal**
* Learn **logic gate operations** and truth tables
* Perform **binary arithmetic and bitwise operations**
* Visualize **data representation at the bit level**
* Practice **digital circuit design and logic synthesis**

---

## 🏗️ Architecture

### System Architecture

```
Digital Logic Lab Platform
 ├── Next.js Frontend
 │    ├── Number System Converter
 │    ├── Logic Gate Simulator
 │    └── Binary Logic Operations
 │
 ├── React Component Layer
 │    └── State Management & Real-time Computation
 │
 └── UI Layer
      └── Tailwind CSS + Dark Mode Support
```

### Component Structure

```
src/
├── app/
│   ├── layout.tsx      # Root application layout
│   ├── page.tsx        # Main dashboard & navigation
│   └── globals.css     # Global styling
└── components/
    ├── BinaryConverter.tsx        # Number system conversion engine
    ├── LogicGateSimulator.tsx     # Logic gate simulation
    └── BinaryLogicOperations.tsx  # Bitwise operation calculator
```

---

## ✨ Features

* 🔢 **Number System Converter**: Multi-base conversion with variable bit-widths, signed/unsigned support, and bit-level visualization.
* 🚪 **Logic Gate Simulator**: Interactive gate operations (AND, OR, NOT, XOR, NAND, NOR, XNOR) with real-time truth table generation.
* ⚡ **Binary Logic Operations Engine**: Step-by-step bitwise operation analysis (AND, OR, XOR, NOT, NAND, NOR).
* 🌙 **Modern UI**: Responsive, Tailwind-based design with dark mode support.

---

## 🚀 Installation & Setup

### Prerequisites

* Node.js >= 18.0.0
* npm >= 8.0.0 or yarn >= 1.22.0
* Git >= 2.0.0

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd digital-logic-lab

# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev



### Production Deployment

```bash
# Build production bundle
npm run build

# Start production server
npm run start

# Preview build locally
npm run preview
```



## 📚 Component Documentation

### BinaryConverter

* Converts numbers across multiple bases
* Handles bit-width and signed/unsigned modes
* Displays visual binary representation

### LogicGateSimulator

* Simulates basic, universal, and exclusive logic gates
* Generates truth tables automatically
* Supports multiple simulation modes

### BinaryLogicOperations

* Performs bitwise operations with detailed analysis
* Displays results in binary, decimal, and hex

---

## 📖 Usage Guide

**Example: Number System Conversion**

1. Select base → "Decimal"
2. Set bit-width → "16-bit"
3. Mode → "Signed"
4. Input → `255`
5. Output → Binary: `0000 0000 1111 1111`, Hex: `00FF`, Octal: `0377`

**Example: Logic Gate Simulation**

* Gate: XOR, Inputs: A=1, B=0 → Output: 1

**Example: Binary Operation**

* A: `1100`, B: `1010`, Operation: `AND` → Result: `1000`

---

## 🔧 Technical Specifications

| Metric           | Value   | Description                     |
| ---------------- | ------- | ------------------------------- |
| Build Time       | \~15s   | Production build                |
| Bundle Size      | \~250KB | Optimized bundle                |
| Load Time        | <2s     | Initial load                    |
| Lighthouse Score | 95+     | Performance, SEO, Accessibility |

**Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Technology Stack**:

* Framework: Next.js 15.5.0
* UI Library: React 19.1.0
* Language: TypeScript 5.x
* Styling: Tailwind CSS 4.0
* Build Tool: Turbopack

---

## 👨‍💻 Development Guide

* **Linting**: `npm run lint`
* **Type Checking**: `npx tsc --noEmit`
* **Testing**: Jest + React Testing Library, Cypress for integration, Lighthouse for performance
* **Code Standards**: ESLint + Prettier, Conventional Commits

---

**Standards**:

* 80% minimum test coverage
* JSDoc documentation for functions
* Lighthouse score >90

---

## 📊 Project Roadmap

* ✅ **Phase 1 (Core Features)**: Number Converter, Logic Gate Simulator, Binary Operations, Responsive UI
* 🚧 **Phase 2 (Advanced)**: CPU Instruction Simulation, Memory Visualization, Pipeline & Cache Simulation
* 📋 **Phase 3 (Educational)**: Interactive Tutorials, Progress Tracking, Exercise Generator, Instructor Dashboard


