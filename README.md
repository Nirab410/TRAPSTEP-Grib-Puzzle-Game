# 🪤 TRAPSTEP

> **A minimalist grid puzzle game about falling floors, laser traps, and planning ahead.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-F7DF1E?logo=javascript&logoColor=black)](#)
[![Web Audio](https://img.shields.io/badge/Sound-Web%20Audio%20API-4A90E2)](#)
[![Offline Ready](https://img.shields.io/badge/Offline-100%25%20Ready-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

---

## 🎯 About the Game

**TRAPSTEP** is a simple yet challenging puzzle game. The goal is straightforward: guide your player from the green **START** tile to the golden **GOAL** tile.

### The Main Twist
**The floor crumbles behind you!** Every time you move onto a new tile, the tile you just left collapses into a bottomless hole. Because you cannot step on broken tiles or walls, one careless step can leave you completely trapped.

As you advance through the **20 handcrafted levels**, new mechanics are introduced:
* **Shadow Clones** that move in opposite directions and also break the floor
* **Ice Tiles** that make you slide across the board
* **Portals** that teleport you across the room
* **Lasers & Switches** that block your path until turned off
* **Keys** you must collect before the goal unlocks
* **Reinforced Bridges** that can be crossed twice before breaking

Every level has been tested and mathematically verified with an internal **pathfinding solver (BFS)** to guarantee it is 100% solvable.

---

## 🧩 Tile Types & Mechanics

| Tile | Symbol | How it Works |
|---|:---:|---|
| **Start** | `START` | The starting position for your player. |
| **Goal** | `★ GOAL` | The exit tile. Reach this tile to beat the level. |
| **Crumbled Floor** | `✖` | The hole left behind when you step off a tile. Impassable. |
| **Shadow Clone** | `👥` | A mirror clone that moves in the opposite direction. If it hits a wall, falls, or touches a laser, you lose! |
| **Ice** | `❄️` | Makes you slide in a straight line until you hit an obstacle. The whole slide path breaks behind you! |
| **Portals** | `🌀 α / β` | Teleports you from one portal to the other. The entrance collapses once you exit. |
| **Laser Gate** | `⚡` | Deadly laser beams. Passing through while active will destroy your player. |
| **Switch** | `🔘` | Step on it (or have your clone step on it) to toggle lasers on or off. |
| **Key** | `🔑` | Collect this key to open locked goal tiles (`🔒 LOCKED`). |
| **Bridge** | `② / ①` | A reinforced purple tile that can be stepped on twice before it breaks. |
| **Trap Trigger** | `▲` | Stepping here triggers sudden collapses in nearby tiles. |

---

## 🗺️ Level Guide (20 Levels)

The game contains 20 progressive puzzle levels:

| Level | Name | Grid | What's New |
|:---:|---|:---:|---|
| **1** | *Fractured Ground* | 4×4 | Basic movement & crumbling floors |
| **2** | *The Key Vault* | 5×5 | Collecting keys to unlock the goal |
| **3** | *Glacial Vector* | 5×5 | Sliding across ice tiles |
| **4** | *Wormhole Drift* | 5×5 | Teleporting between portals |
| **5** | *Laser Grid Lockdown* | 5×5 | Using switches to turn off lasers |
| **6** | *The Doppelgänger* | 5×5 | Controlling your shadow clone |
| **7** | *Twin Symmetry* | 5×5 | Using the clone to hit distant switches |
| **8** | *Glacial Abyss* | 6×6 | Combining ice slides, portals, and bridges |
| **9** | *Dual Laser Protocol* | 6×6 | 25-second timer with dual lasers and clones |
| **10** | *The Quantum Knot* | 6×6 | Complex figure-8 paths with double portals |
| **11** | *Mirror Velocity* | 6×6 | Dual clone movement over ice slides |
| **12** | *The Crucible* | 6×6 | Clones + ice + portals + lasers in one puzzle |
| **13** | *Hypercube Drift* | 6×6 | Move-limited portal routing (14 moves) |
| **14** | *The Twin Paradox* | 6×6 | Asymmetric clone puzzle with double bridges |
| **15** | *Glacial Prison* | 6×6 | Ice rebounds and key retrieval |
| **16** | *Chrono Breakdown* | 6×6 | Fast 18-second speed run |
| **17** | *Binary Synchronization* | 7×7 | Large 7×7 clone and laser maze |
| **18** | *Shadow Wormhole Matrix* | 7×7 | 7×7 clone + portals + keys (30s timer) |
| **19** | *Event Horizon* | 7×7 | 7×7 ice vectors + portals + move budget |
| **20** | *The Grand Finale* | 7×7 | The ultimate puzzle combining every mechanic |

> **🎲 Endless Mode:** Want to keep playing? Click the **🗺️ Level Select** button and choose **"Play Endless Solvable Board"** for randomly generated, verified puzzles.

---

## 💻 Tech Stack & Architecture

TRAPSTEP is built purely with standard web technologies. No React, no Vue, no Webpack, no external libraries, and no internet connection required.

```
d:/Demo/
├── index.html        # Clean semantic HTML5 layout & modal dialogs
├── style.css         # Modern dark/light theme, responsive grid & animations
├── README.md         # Documentation
└── js/
    ├── audio.js      # Procedural sound effects using Web Audio API (no .mp3 files needed)
    ├── solver.js     # Built-in BFS pathfinding solver to guarantee levels are solvable
    ├── levels.js     # Level data for all 20 levels
    ├── generator.js  # Endless mode generator with solver verification
    └── game.js       # Core game loop, inputs, animations, and localStorage save system
```

### Key Technical Details
1. **Built-in Solver (`js/solver.js`):** Uses Breadth-First Search (BFS) with bitmasks to test and verify every puzzle in milliseconds before the player starts.
2. **Procedural Web Audio (`js/audio.js`):** Generates all sound effects (steps, clicks, slides, warps, victory fanfares) directly using code and oscillators. Zero audio file downloads.
3. **Local Storage:** High scores, best moves, fastest times, stars, and dark/light theme preferences are saved in your browser automatically.
4. **Responsive:** Works smoothly on desktop and mobile screens.

---

## 🎮 How to Play & Controls

* **Keyboard:**
  * `Arrow Keys` or `W, A, S, D` — Move
  * `R` — Restart level
  * `Escape` — Close menu / level select
* **Mouse:** Click or tap any adjacent tile to step there.
* **Mobile / Touch:**
  * **Swipe** anywhere on the screen to move
  * **On-Screen D-Pad** buttons at the bottom of the screen

---

## 🚀 How to Run the Game

1. Download or clone this folder.
2. Double-click [`index.html`](file:///d:/Demo/index.html) to open it directly in any browser (Chrome, Edge, Firefox, Safari).
3. That's it! No installations or local servers needed.

---

## 🌓 Themes & Sound

* **Theme Toggle:** Click the `🌙` / `☀️` button in the top right to switch between Dark Mode and Light Mode.
* **Sound Toggle:** Click the `🔊` / `🔇` button to mute or unmute audio.
* **Level Select:** Click `🗺️` to replay any unlocked level or jump into Endless Mode.

---

## 📄 License

Open source under the [MIT License](LICENSE).
