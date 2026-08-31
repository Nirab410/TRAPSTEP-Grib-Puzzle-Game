# 🌌 TRAPSTEP: Abyss Protocol

> **"Step carefully. The ground is falling."**  
> An ultra-polished, deterministic, grid-based tactical puzzle game engineered with pure vanilla web technologies and mathematical state-space validation.

[![JavaScript](https://img.shields.io/badge/Language-Vanilla%20JavaScript%20(ES6+)-F7DF1E?logo=javascript&logoColor=black)](#)
[![Markup & Styling](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20Grid-E34F26?logo=html5&logoColor=white)](#)
[![Audio Engine](https://img.shields.io/badge/Audio-Procedural%20Web%20Audio%20API-4A90E2)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20External%20Libraries-success)](#)
[![Offline Capable](https://img.shields.io/badge/Architecture-100%25%20Offline%20Ready-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

---

## 📌 Executive Summary

**TRAPSTEP: Abyss Protocol** is a hardcore, minimalist, grid-based puzzle game where every single step mutates the board. 

The player navigates from a green **START** tile to a radiant golden **GOAL** beacon. However, the foundational law of the universe is **Trail Collapse**: *every tile departed permanently crumbles into an impassable void*. 

As the campaign progresses, the game shifts from simple spatial navigation into a profound, multi-entity tactical brain-teaser featuring **Shadow Doppelgängers**, **Frictionless Ice Vectors**, **Quantum Wormholes**, **State-Parity Laser Barricades**, and **Cryptographic Key Enclosures**.

Every single level in the game is mathematically proven to be **100% solvable** via an integrated multi-entity Breadth-First Search (BFS) state-space solver.

---

## 🕹️ Core Game Mechanics

```
 [START] ──> [ICE SLIDE] ──> [PORTAL α] ──> [LASER SWITCH] ──> [KEY 🔑] ──> [GOAL ★]
                  │                              │
          (Trail Collapse)              (Shadow Clone Mirror)
```

### Mechanics Reference Matrix

| Mechanic | Symbol | Tactical Behavior |
|---|:---:|---|
| **Trail Collapse** | `✖` | The departure tile instantly collapses into the abyss. Backtracking is physically impossible. |
| **The Shadow Doppelgänger** | `👥` | A holographic clone mirrors your movements in real-time. Both bodies collapse ground behind them. If the clone falls into a void, hits a barrier, or touches a laser, you **instantly fail**. |
| **Ice Momentum Vectors** | `❄️` | Entering an ice tile induces continuous frictionless sliding until colliding with a solid barrier. Traversed ice tiles crumble in a chain reaction. |
| **Quantum Wormholes** | `🌀 α/β` | Stepping into Portal α instantly warps the entity to Portal β (and vice versa). The entrance portal permanently dissolves upon exit. |
| **Laser Barricades** | `⚡` | Deadly high-energy laser grids that incinerate any entity attempting passage while active. |
| **Step Switches** | `🔘` | Pressure plates toggled by either the player or the shadow clone to alternate laser grid states (`ACTIVE` $\leftrightarrow$ `DISABLED`). |
| **Energy Keys & Vaults** | `🔑 / 🔒` | The Goal begins in a locked quarantine state (`🔒 LOCKED`). The player must route to the Key first, leaving an uncollapsed corridor to return to the Goal. |
| **Reinforced Bridges** | `② / ①` | Multi-step tiles that withstand two crossings before falling, enabling complex knot, ribbon, and figure-8 paths. |
| **Hazard Traps** | `▲` | Trigger tiles that initiate remote collateral collapses across distant corridors when stepped upon. |

---

## 🗺️ 20-Level Mastermind Campaign

The campaign features **20 handcrafted master levels** engineered with strict move budgets, speed runs, and layered mechanics:

| Level | Codename | Subtitle | Grid | Key Mechanics | Optimal Moves | States Explored |
|:---:|---|---|:---:|---|:---:|:---:|
| **01** | *Fractured Ground* | The Floor is Falling | 4×4 | Foundational Trail Collapse & Decoys | 6 | 21 |
| **02** | *The Key Vault* | No Return Path | 5×5 | Energy Key 🔑 & Locked Goal 🔒 | 12 | 505 |
| **03** | *Glacial Vector* | Momentum & Slide | 5×5 | Frictionless Ice Slide Physics (❄️) | 5 | 22 |
| **04** | *Wormhole Drift* | Quantum Displacement | 5×5 | Quantum Portals α & β (🌀) | 6 | 56 |
| **05** | *Laser Grid Lockdown* | Step-Parity Switching | 5×5 | Laser Barricades (⚡) & Switches (🔘) | 8 | 177 |
| **06** | *The Doppelgänger* | Twin Synchronization | 5×5 | Shadow Clone (👥) Dual-Body Survival | 4 | 15 |
| **07** | *Twin Symmetry* | Remote Clone Disarm | 5×5 | Remote Switch Disarm operated by Clone | 4 | 14 |
| **08** | *Glacial Abyss* | Momentum & Quantum Knot | 6×6 | Ice Slides + Portals + 2-Step Bridges | 6 | 137 |
| **09** | *Dual Laser Protocol* | Shadow Precision | 6×6 | Dual Lasers + Shadow Clone (25s Timer) | 9 | 437 |
| **10** | *The Quantum Knot* | Multiphase Labyrinth | 6×6 | Double Portals + Double Bridges + Key | 11 | 4,748 |
| **11** | *Mirror Velocity* | Extreme Dual Slide | 6×6 | Clone + Ice Slide + Laser Disarm | 7 | 66 |
| **12** | *Abyss Protocol: Alpha* | Multi-Entity Crucible | 6×6 | Clone + Ice + Portals + Laser Gate | 9 | 109 |
| **13** | *Hypercube Drift* | Quantum Momentum | 6×6 | Ice Slides + Portal Re-routing (14 Moves) | 5 | 38 |
| **14** | *The Twin Paradox* | Asymmetric Mirroring | 6×6 | Shadow Clone + Laser Gate + 2-Step Bridges | 7 | 66 |
| **15** | *Glacial Prison* | The Rebound Lock | 6×6 | Dual Ice Vectors + Key + 2-Step Bridge | 12 | 1,790 |
| **16** | *Chrono Breakdown* | Speed Labyrinth | 6×6 | 18s Countdown + Key + Laser Gate + Portals | 13 | 6,827 |
| **17** | *Binary Synchronization* | Dual 7×7 Chamber | 7×7 | 7×7 Shadow Clone + Laser + Bridges | 8 | 283 |
| **18** | *Shadow Wormhole Matrix* | Dimensional Entanglement | 7×7 | 7×7 Clone + Key + Portals + Bridges (30s) | 12 | 1,564 |
| **19** | *Event Horizon* | The Glacial Warp | 7×7 | 7×7 Ice Vectors + Portals + 22 Moves + 28s | 15 | 29,014 |
| **20** | *The Final Abyss* | Singularity Grandmaster | 7×7 | **The Ultimate Crucible**: All mechanics combined | 12 | 696 |

> **🎲 Endless Mode Included:** In addition to the 20 handcrafted levels, players can generate infinite procedurally verified boards using the built-in level generator and BFS validator.

---

## 🏗️ Technical Architecture & Engineering

TRAPSTEP is engineered strictly with native web standards—**no frameworks, no bundlers, no external dependencies, and zero remote asset fetches**.

```
d:/Demo/
├── index.html        # Semantic HTML5 markup, HUD layout, accessible dialogs & D-Pad
├── style.css         # CSS Variables, Dark/Light Themes, 60fps GPU Keyframe animations
├── README.md         # Comprehensive engineering & system documentation
└── js/
    ├── audio.js      # Procedural Web Audio API synthesis engine (zero audio asset files)
    ├── solver.js     # Exact multi-entity BFS state-space pathfinding & validation engine
    ├── levels.js     # Handcrafted level configurations & rule matrices (Levels 1-20)
    ├── generator.js  # Procedural level generator with live BFS solvability validation
    └── game.js       # Core state machine, multi-entity physics, inputs & localStorage
```

### Architectural Highlights

1. **Deterministic State-Space BFS Solver (`js/solver.js`)**:
   - Represents grid states using a compact `BigInt` bitmask (`1n << BigInt(idx)`) for $O(1)$ collision and visitation checks.
   - Evaluates full multi-entity state tuples:
     $$\mathcal{S} = \big( \mathbf{p}_{\text{player}}, \mathbf{p}_{\text{shadow}}, \mathcal{M}_{\text{blocked}}, \mathcal{D}_{\text{durability}}, \kappa_{\text{key}}, \lambda_{\text{laser}} \big)$$
   - Verifies the existence of an optimal solution path before allowing the player to engage with any generated or custom stage.

2. **Procedural Web Audio Synthesizer (`js/audio.js`)**:
   - Generates all dynamic sound effects in real-time via `AudioContext`, `OscillatorNode`, and `GainNode`.
   - Includes custom frequency-modulated acoustic signatures for:
     - Footsteps (sine frequency drop)
     - Shadow clone movement (harmonic double resonance)
     - Ice momentum sliding (frequency linear ramp)
     - Quantum portal warp (exponential sweep)
     - Laser switches (square wave snap)
     - Key retrieval (triad arpeggio: D5 $\to$ A5 $\to$ D6)
     - Collapse crunch (filtered white noise + sub-triangle wave)

3. **Sub-Pixel Responsive Alignment (`ResizeObserver`)**:
   - Uses `ResizeObserver` with `getBoundingClientRect()` to compute exact offset transforms (`translate3d(x, y, 0)`), guaranteeing that the player and shadow tokens remain pixel-perfect across viewport resizes and mobile device orientations.

4. **Persistence Engine (`localStorage`)**:
   - Persists unlocked levels, star achievements ($1 \star - 3 \star$), move efficiency metrics, speedrun records, theme preferences, and audio toggle states.

---

## 🎮 Controls & Accessibility

* **Keyboard Controls:**
  * `W, A, S, D` or `Arrow Keys (↑, ↓, ←, →)` — Move Avatar
  * `R` — Instant Level Restart
  * `Escape` — Close Modals / Level Select
* **Mouse & Pointer:**
  * **Direct Click / Tap** — Click on any valid adjacent tile to move directly there
* **Touch & Mobile:**
  * **Swipe Gestures** — Touch swipe in any direction (`UP`, `DOWN`, `LEFT`, `RIGHT`)
  * **On-Screen D-Pad** — Floating tactile glassmorphic directional pad

---

## 🚀 Getting Started

No installation, build tools, or server dependencies required.

### Instant Execution
Simply double-click [`index.html`](file:///d:/Demo/index.html) or open it in any modern web browser.

### Local Development Server (Optional)
If running via a local development server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js
npx serve .
```
Navigate to `http://localhost:8080` in your browser.

---

## 🌓 Visual Customization

* **Theme Switching:** Toggle between **Cyber Dark** (`🌙`) and **Clean Light** (`☀️`) via the top-right header control.
* **Audio Switch:** Toggle procedural sound effects on/off (`🔊` / `🔇`) instantly with saved preference.
* **Level Selector:** Open the Level Drawer (`🗺️`) at any time to replay cleared stages or launch Endless Mode.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Engineered with precision for puzzle enthusiasts.*
