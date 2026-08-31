/**
 * TRAPSTEP: ABYSS PROTOCOL - 20 Hardcore Mastermind Puzzle Levels
 * Features Shadow Clones, Ice Momentum, Quantum Portals, Laser Gates, Keys, and 2-Step Bridges.
 */

const LEVELS = [
    {
        id: 1,
        title: "Fractured Ground",
        subtitle: "The Floor is Falling",
        rows: 4,
        cols: 4,
        start: { r: 3, c: 0 },
        goal: { r: 0, c: 3 },
        walls: [
            { r: 1, c: 1 },
            { r: 2, c: 2 }
        ],
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "Every tile you step off crumbles permanently into the void! Plan your path to the Golden Goal."
        ]
    },
    {
        id: 2,
        title: "The Key Vault",
        subtitle: "No Return Path",
        rows: 5,
        cols: 5,
        start: { r: 4, c: 4 },
        key: { r: 0, c: 0 },
        goal: { r: 0, c: 4 },
        walls: [
            { r: 1, c: 2 },
            { r: 2, c: 2 },
            { r: 3, c: 2 }
        ],
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "The Goal is locked! You must retrieve the Energy Key 🔑 without collapsing your escape corridor."
        ]
    },
    {
        id: 3,
        title: "Glacial Vector",
        subtitle: "Momentum & Slide",
        rows: 5,
        cols: 5,
        start: { r: 4, c: 0 },
        goal: { r: 0, c: 4 },
        walls: [
            { r: 1, c: 3 },
            { r: 3, c: 1 }
        ],
        iceTiles: [
            { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 },
            { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }
        ],
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "Ice Tiles (❄️): Stepping on ice makes you slide until hitting a wall, collapsing every ice tile you slide through!"
        ]
    },
    {
        id: 4,
        title: "Wormhole Drift",
        subtitle: "Quantum Displacement",
        rows: 5,
        cols: 5,
        start: { r: 4, c: 0 },
        goal: { r: 0, c: 4 },
        walls: [
            { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }
        ],
        portals: [
            { r: 3, c: 2 },
            { r: 1, c: 2 }
        ],
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "Portals (🌀): Entering one portal instantly warps you to the other. The entry portal collapses behind you!"
        ]
    },
    {
        id: 5,
        title: "Laser Grid Lockdown",
        subtitle: "Step-Parity Switching",
        rows: 5,
        cols: 5,
        start: { r: 4, c: 0 },
        goal: { r: 0, c: 4 },
        walls: [
            { r: 1, c: 1 }, { r: 3, c: 3 }
        ],
        laserGates: [
            { r: 1, c: 3 }
        ],
        switches: [
            { r: 4, c: 2 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "Laser Gates (⚡): Deadly laser grids block the path. Step on the Switch (🔘) to toggle the laser on/off."
        ]
    },
    {
        id: 6,
        title: "The Doppelgänger",
        subtitle: "Twin Synchronization",
        rows: 5,
        cols: 5,
        start: { r: 4, c: 0 },
        shadowStart: { r: 0, c: 4 },
        shadowMirror: "full",
        goal: { r: 0, c: 0 },
        walls: [
            { r: 2, c: 1 }, { r: 2, c: 3 }
        ],
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "The Shadow Clone (👥): Moves in mirror reflection to you! If the shadow hits a wall or void, you FAIL."
        ]
    },
    {
        id: 7,
        title: "Twin Symmetry",
        subtitle: "Remote Clone Disarm",
        rows: 5,
        cols: 5,
        start: { r: 4, c: 0 },
        shadowStart: { r: 0, c: 4 },
        shadowMirror: "full",
        goal: { r: 0, c: 0 },
        walls: [
            { r: 1, c: 2 }, { r: 3, c: 2 }
        ],
        laserGates: [
            { r: 0, c: 1 }
        ],
        switches: [
            { r: 4, c: 3 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: null,
        timeLimit: null,
        tutorial: [
            "Navigate your player so your Shadow Clone lands on the remote switch, opening the laser gate for you!"
        ]
    },
    {
        id: 8,
        title: "Glacial Abyss",
        subtitle: "Momentum & Quantum Knot",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        goal: { r: 0, c: 5 },
        walls: [
            { r: 1, c: 2 }, { r: 4, c: 3 }, { r: 2, c: 5 }
        ],
        iceTiles: [
            { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 },
            { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 3, c: 3 }
        ],
        multiStepTiles: [
            { r: 2, c: 3, steps: 2 }
        ],
        portals: [
            { r: 5, c: 4 },
            { r: 1, c: 1 }
        ],
        trailCollapse: true,
        maxMoves: 16,
        timeLimit: null,
        tutorial: null
    },
    {
        id: 9,
        title: "Dual Laser Protocol",
        subtitle: "Shadow Precision",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        shadowStart: { r: 0, c: 5 },
        shadowMirror: "full",
        goal: { r: 0, c: 0 },
        walls: [
            { r: 2, c: 1 }, { r: 3, c: 4 }
        ],
        laserGates: [
            { r: 1, c: 0 }, { r: 4, c: 5 }
        ],
        switches: [
            { r: 5, c: 3 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: 16,
        timeLimit: 25,
        tutorial: null
    },
    {
        id: 10,
        title: "The Quantum Knot",
        subtitle: "Multiphase Labyrinth",
        rows: 6,
        cols: 6,
        start: { r: 0, c: 0 },
        key: { r: 5, c: 5 },
        goal: { r: 0, c: 5 },
        walls: [
            { r: 1, c: 1 }, { r: 4, c: 4 }, { r: 2, c: 4 }
        ],
        multiStepTiles: [
            { r: 2, c: 2, steps: 2 },
            { r: 3, c: 3, steps: 2 }
        ],
        portals: [
            { r: 0, c: 3 },
            { r: 5, c: 2 }
        ],
        trailCollapse: true,
        maxMoves: 18,
        timeLimit: null,
        tutorial: null
    },
    {
        id: 11,
        title: "Mirror Velocity",
        subtitle: "Extreme Dual Slide",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        shadowStart: { r: 0, c: 5 },
        shadowMirror: "full",
        goal: { r: 0, c: 2 },
        walls: [
            { r: 1, c: 3 }, { r: 4, c: 2 }
        ],
        iceTiles: [
            { r: 5, c: 1 }, { r: 5, c: 2 },
            { r: 0, c: 3 }, { r: 0, c: 4 }
        ],
        laserGates: [
            { r: 2, c: 2 }
        ],
        switches: [
            { r: 3, c: 5 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: 18,
        timeLimit: 22,
        tutorial: null
    },
    {
        id: 12,
        title: "Abyss Protocol: Alpha",
        subtitle: "Multi-Entity Crucible",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        shadowStart: { r: 0, c: 5 },
        shadowMirror: "full",
        key: { r: 2, c: 2 },
        goal: { r: 0, c: 0 },
        walls: [
            { r: 1, c: 2 }, { r: 4, c: 3 }
        ],
        iceTiles: [
            { r: 5, c: 1 }, { r: 5, c: 2 },
            { r: 0, c: 3 }, { r: 0, c: 4 }
        ],
        portals: [
            { r: 3, c: 0 }, { r: 2, c: 5 }
        ],
        laserGates: [
            { r: 1, c: 0 }
        ],
        switches: [
            { r: 5, c: 4 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: 20,
        timeLimit: 30,
        tutorial: null
    },
    {
        id: 13,
        title: "Hypercube Drift",
        subtitle: "Quantum Momentum",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        goal: { r: 0, c: 5 },
        walls: [
            { r: 1, c: 1 }, { r: 1, c: 4 }, { r: 4, c: 1 }, { r: 4, c: 4 }
        ],
        iceTiles: [
            { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 5, c: 3 },
            { r: 2, c: 2 }, { r: 2, c: 3 }
        ],
        portals: [
            { r: 5, c: 4 }, { r: 0, c: 1 }
        ],
        trailCollapse: true,
        maxMoves: 14,
        timeLimit: null,
        tutorial: null
    },
    {
        id: 14,
        title: "The Twin Paradox",
        subtitle: "Asymmetric Mirroring",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        shadowStart: { r: 0, c: 5 },
        shadowMirror: "full",
        goal: { r: 0, c: 0 },
        walls: [
            { r: 1, c: 2 }, { r: 4, c: 3 }, { r: 2, c: 4 }
        ],
        multiStepTiles: [
            { r: 3, c: 2, steps: 2 }, { r: 2, c: 3, steps: 2 }
        ],
        laserGates: [
            { r: 1, c: 0 }
        ],
        switches: [
            { r: 5, c: 4 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: 16,
        timeLimit: null,
        tutorial: null
    },
    {
        id: 15,
        title: "Glacial Prison",
        subtitle: "The Rebound Lock",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 5 },
        key: { r: 0, c: 0 },
        goal: { r: 5, c: 0 },
        walls: [
            { r: 1, c: 3 }, { r: 3, c: 1 }, { r: 4, c: 4 }
        ],
        iceTiles: [
            { r: 5, c: 2 }, { r: 5, c: 3 }, { r: 5, c: 4 },
            { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }
        ],
        multiStepTiles: [
            { r: 2, c: 2, steps: 2 }
        ],
        trailCollapse: true,
        maxMoves: 16,
        timeLimit: null,
        tutorial: null
    },
    {
        id: 16,
        title: "Chrono Breakdown",
        subtitle: "Speed Labyrinth",
        rows: 6,
        cols: 6,
        start: { r: 5, c: 0 },
        key: { r: 0, c: 5 },
        goal: { r: 0, c: 0 },
        walls: [
            { r: 2, c: 2 }, { r: 3, c: 3 }
        ],
        portals: [
            { r: 4, c: 2 }, { r: 1, c: 3 }
        ],
        laserGates: [
            { r: 0, c: 1 }
        ],
        switches: [
            { r: 5, c: 3 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: 16,
        timeLimit: 18,
        tutorial: null
    },
    {
        id: 17,
        title: "Binary Synchronization",
        subtitle: "Dual 7×7 Chamber",
        rows: 7,
        cols: 7,
        start: { r: 6, c: 0 },
        shadowStart: { r: 0, c: 6 },
        shadowMirror: "full",
        goal: { r: 0, c: 0 },
        walls: [
            { r: 1, c: 3 }, { r: 5, c: 3 },
            { r: 3, c: 1 }, { r: 3, c: 5 }
        ],
        multiStepTiles: [
            { r: 4, c: 2, steps: 2 }, { r: 2, c: 4, steps: 2 }
        ],
        laserGates: [
            { r: 1, c: 0 }
        ],
        switches: [
            { r: 6, c: 4 }
        ],
        initialLasersActive: true,
        trailCollapse: true,
        maxMoves: 18,
        timeLimit: null,
        tutorial: null
    },
    {
        id: 18,
        title: "Shadow Wormhole Matrix",
        subtitle: "Dimensional Entanglement",
        rows: 7,
        cols: 7,
        start: { r: 6, c: 0 },
        shadowStart: { r: 0, c: 6 },
        shadowMirror: "full",
        key: { r: 3, c: 3 },
        goal: { r: 0, c: 0 },
        walls: [
            { r: 2, c: 2 }, { r: 4, c: 4 },
            { r: 2, c: 4 }, { r: 4, c: 2 }
        ],
        portals: [
            { r: 6, c: 3 }, { r: 0, c: 3 }
        ],
        multiStepTiles: [
            { r: 3, c: 3, steps: 2 }
        ],
        trailCollapse: true,
        maxMoves: 20,
        timeLimit: 30,
        tutorial: null
    },
    {
        id: 19,
        title: "Event Horizon",
        subtitle: "The Glacial Warp",
        rows: 7,
        cols: 7,
        start: { r: 6, c: 6 },
        key: { r: 0, c: 0 },
        goal: { r: 6, c: 0 },
        walls: [
            { r: 1, c: 2 }, { r: 1, c: 5 },
            { r: 5, c: 1 }, { r: 5, c: 4 }
        ],
        iceTiles: [
            { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
            { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }
        ],
        portals: [
            { r: 4, c: 1 }, { r: 2, c: 5 }
        ],
        multiStepTiles: [
            { r: 3, c: 3, steps: 2 }
        ],
        trailCollapse: true,
        maxMoves: 22,
        timeLimit: 28,
        tutorial: null
    },
    {
        id: 20,
        title: "The Final Abyss",
        subtitle: "Singularity Grandmaster",
        rows: 7,
        cols: 7,
        start: { r: 6, c: 0 },
        shadowStart: { r: 0, c: 6 },
        shadowMirror: "full",
        key: { r: 3, c: 3 },
        goal: { r: 0, c: 0 },
        walls: [
            { r: 1, c: 2 }, { r: 1, c: 4 },
            { r: 5, c: 2 }, { r: 5, c: 4 }
        ],
        iceTiles: [
            { r: 6, c: 1 }, { r: 6, c: 2 },
            { r: 0, c: 4 }, { r: 0, c: 5 }
        ],
        portals: [
            { r: 4, c: 0 }, { r: 2, c: 6 }
        ],
        laserGates: [
            { r: 1, c: 0 }
        ],
        switches: [
            { r: 6, c: 5 }
        ],
        initialLasersActive: true,
        multiStepTiles: [
            { r: 3, c: 3, steps: 2 },
            { r: 4, c: 3, steps: 2 },
            { r: 2, c: 3, steps: 2 }
        ],
        trailCollapse: true,
        maxMoves: 26,
        timeLimit: 35,
        tutorial: null
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVELS };
} else {
    window.LEVELS = LEVELS;
}
