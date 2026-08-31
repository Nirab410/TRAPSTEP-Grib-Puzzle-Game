/**
 * TRAPSTEP - Procedural Level Generator
 * Creates infinite solvable puzzle boards with guaranteed BFS validation.
 */

class LevelGenerator {
    /**
     * Generates a random solvable level matching specified parameters.
     * @param {Object} options - Generator options { rows, cols, wallCount, hasTimer, hasMoveLimit, difficulty }
     * @returns {Object} Solvable level object
     */
    static generate(options = {}) {
        const rows = options.rows || 5;
        const cols = options.cols || 5;
        const difficulty = options.difficulty || 'medium'; // easy, medium, hard, chaos

        let attempts = 0;
        const maxAttempts = 200;

        while (attempts < maxAttempts) {
            attempts++;

            // Pick start and goal at opposite corners or far edges
            const corners = [
                { start: { r: rows - 1, c: 0 }, goal: { r: 0, c: cols - 1 } },
                { start: { r: 0, c: 0 }, goal: { r: rows - 1, c: cols - 1 } },
                { start: { r: rows - 1, c: cols - 1 }, goal: { r: 0, c: 0 } },
                { start: { r: 0, c: cols - 1 }, goal: { r: rows - 1, c: 0 } }
            ];
            const cornerPair = corners[Math.floor(Math.random() * corners.length)];
            const start = cornerPair.start;
            const goal = cornerPair.goal;

            // Generate wall obstacles
            const totalCells = rows * cols;
            let targetWalls = Math.floor(totalCells * 0.18);
            if (difficulty === 'easy') targetWalls = Math.floor(totalCells * 0.12);
            if (difficulty === 'hard') targetWalls = Math.floor(totalCells * 0.22);
            if (difficulty === 'chaos') targetWalls = Math.floor(totalCells * 0.25);

            const walls = [];
            const occupied = new Set();
            occupied.add(`${start.r},${start.c}`);
            occupied.add(`${goal.r},${goal.c}`);

            // Ensure start and goal neighbors are not completely enclosed
            const candidateCells = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const key = `${r},${c}`;
                    if (!occupied.has(key)) {
                        candidateCells.push({ r, c });
                    }
                }
            }

            // Shuffle candidates
            for (let i = candidateCells.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidateCells[i], candidateCells[j]] = [candidateCells[j], candidateCells[i]];
            }

            for (let i = 0; i < Math.min(targetWalls, candidateCells.length); i++) {
                walls.push(candidateCells[i]);
            }

            // Add hazard triggers for hard/chaos
            const trapTriggers = {};
            if (difficulty === 'hard' || difficulty === 'chaos') {
                const hazardCount = difficulty === 'chaos' ? 2 : 1;
                for (let h = 0; h < hazardCount; h++) {
                    const available = candidateCells.filter(c => !walls.some(w => w.r === c.r && w.c === c.c));
                    if (available.length > 2) {
                        const triggerTile = available[Math.floor(Math.random() * available.length)];
                        const targetTile = available.find(c => c !== triggerTile && (Math.abs(c.r - triggerTile.r) + Math.abs(c.c - triggerTile.c) === 1));
                        if (targetTile) {
                            trapTriggers[`${triggerTile.r},${triggerTile.c}`] = [{ r: targetTile.r, c: targetTile.c }];
                        }
                    }
                }
            }

            const candidateLevel = {
                id: 'endless',
                title: `Endless #${Math.floor(Math.random() * 9000 + 1000)}`,
                subtitle: `${rows}×${cols} ${difficulty.toUpperCase()}`,
                rows,
                cols,
                start,
                goal,
                walls,
                trapTriggers: Object.keys(trapTriggers).length > 0 ? trapTriggers : undefined,
                trailCollapse: true,
                maxMoves: null,
                timeLimit: null
            };

            // Run BFS Solver to verify solvability
            const solution = (typeof TrapStepSolver !== 'undefined' ? TrapStepSolver : require('./solver.js')).solve(candidateLevel);

            if (solution.solvable) {
                const minMoves = solution.minMoves;
                // Ensure puzzle is not trivially short (at least 6-8 moves)
                const minThreshold = Math.min(rows + cols - 2, 6);
                if (minMoves >= minThreshold) {
                    // Set balanced constraints based on difficulty
                    if (options.hasMoveLimit || difficulty === 'hard' || difficulty === 'chaos') {
                        candidateLevel.maxMoves = Math.round(minMoves * (difficulty === 'chaos' ? 1.5 : 1.7));
                    }
                    if (options.hasTimer || difficulty === 'hard' || difficulty === 'chaos') {
                        candidateLevel.timeLimit = Math.max(12, Math.round(minMoves * (difficulty === 'chaos' ? 2.2 : 2.8)));
                    }
                    candidateLevel.solution = solution;
                    return candidateLevel;
                }
            }
        }

        // Fallback guaranteed template if random generation took too long
        return {
            id: 'endless',
            title: `Endless #${Math.floor(Math.random() * 9000 + 1000)}`,
            subtitle: `${rows}×${cols} Standard`,
            rows: 5,
            cols: 5,
            start: { r: 4, c: 0 },
            goal: { r: 0, c: 4 },
            walls: [{ r: 2, c: 1 }, { r: 2, c: 3 }],
            trailCollapse: true,
            maxMoves: 14,
            timeLimit: 20
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = LevelGenerator;
} else {
    window.LevelGenerator = LevelGenerator;
}
