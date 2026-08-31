/**
 * TRAPSTEP - Hardcore Multi-Entity State-Space BFS Solver
 * Validates complex puzzles with Shadow Clones, Ice Momentum, Portals, Laser Gates, Keys, and Reinforced Bridges.
 */

class TrapStepSolver {
    static getIndex(r, c, cols) {
        return r * cols + c;
    }

    static isBitSet(mask, idx) {
        return (mask & (1n << BigInt(idx))) !== 0n;
    }

    static setBit(mask, idx) {
        return mask | (1n << BigInt(idx));
    }

    /**
     * Solves the given hardcore level configuration.
     * @param {Object} level - Level definition
     * @returns {Object} { solvable: boolean, minMoves: number, path: Array, statesExplored: number }
     */
    static solve(level) {
        const rows = level.rows;
        const cols = level.cols;
        const start = level.start;
        const goal = level.goal;
        const keyPos = level.key || null;
        const shadowStart = level.shadowStart || null;
        const maxMoves = level.maxMoves || 80;

        // Build static walls bitmask
        let initialBlockedMask = 0n;
        if (level.walls) {
            for (const w of level.walls) {
                initialBlockedMask = this.setBit(initialBlockedMask, this.getIndex(w.r, w.c, cols));
            }
        }

        // Durability map
        const initialDurability = {};
        if (level.multiStepTiles) {
            for (const mst of level.multiStepTiles) {
                initialDurability[this.getIndex(mst.r, mst.c, cols)] = mst.steps || 2;
            }
        }

        // Ice tiles set
        const iceIndices = new Set();
        if (level.iceTiles) {
            for (const it of level.iceTiles) {
                iceIndices.add(this.getIndex(it.r, it.c, cols));
            }
        }

        // Portals map: indexA <-> indexB
        const portalsMap = new Map();
        if (level.portals && level.portals.length >= 2) {
            const pA = level.portals[0];
            const pB = level.portals[1];
            const idxA = this.getIndex(pA.r, pA.c, cols);
            const idxB = this.getIndex(pB.r, pB.c, cols);
            portalsMap.set(idxA, { r: pB.r, c: pB.c, idx: idxB });
            portalsMap.set(idxB, { r: pA.r, c: pA.c, idx: idxA });
        }

        // Laser gates and Switches sets
        const laserIndices = new Set();
        if (level.laserGates) {
            for (const lg of level.laserGates) {
                laserIndices.add(this.getIndex(lg.r, lg.c, cols));
            }
        }

        const switchIndices = new Set();
        if (level.switches) {
            for (const sw of level.switches) {
                switchIndices.add(this.getIndex(sw.r, sw.c, cols));
            }
        }

        const initialLasersActive = laserIndices.size > 0 ? (level.initialLasersActive !== false) : false;

        const serializeDurability = (durMap) => {
            return Object.entries(durMap).map(([k, v]) => `${k}:${v}`).sort().join(';');
        };

        const initialShadow = shadowStart ? { r: shadowStart.r, c: shadowStart.c } : null;

        // BFS Queue
        const queue = [
            {
                player: { r: start.r, c: start.c },
                shadow: initialShadow,
                mask: initialBlockedMask,
                hasKey: !keyPos,
                lasersActive: initialLasersActive,
                durability: { ...initialDurability },
                moves: 0,
                path: [{ r: start.r, c: start.c }]
            }
        ];

        const visited = new Set();
        const startKey = `${start.r},${start.c}|${initialShadow ? `${initialShadow.r},${initialShadow.c}` : 'none'}|${!keyPos ? 1 : 0}|${initialLasersActive ? 1 : 0}|${initialBlockedMask.toString()}|${serializeDurability(initialDurability)}`;
        visited.add(startKey);

        const directions = [
            { dr: -1, dc: 0, name: 'UP' },
            { dr: 1, dc: 0, name: 'DOWN' },
            { dr: 0, dc: -1, name: 'LEFT' },
            { dr: 0, dc: 1, name: 'RIGHT' }
        ];

        let statesExplored = 0;

        while (queue.length > 0) {
            const current = queue.shift();
            statesExplored++;

            // Check goal condition
            if (current.player.r === goal.r && current.player.c === goal.c && current.hasKey) {
                return {
                    solvable: true,
                    minMoves: current.moves,
                    path: current.path,
                    statesExplored
                };
            }

            if (current.moves >= maxMoves) {
                continue;
            }

            for (const dir of directions) {
                let pNr = current.player.r + dir.dr;
                let pNc = current.player.c + dir.dc;

                // 1. In-bounds check for player
                if (pNr < 0 || pNr >= rows || pNc < 0 || pNc >= cols) {
                    continue;
                }

                let pNextIdx = this.getIndex(pNr, pNc, cols);

                // Is player target blocked by wall/void?
                if (this.isBitSet(current.mask, pNextIdx)) {
                    continue;
                }

                // Is player target blocked by active laser?
                if (current.lasersActive && laserIndices.has(pNextIdx)) {
                    continue;
                }

                let willHaveKey = current.hasKey;
                if (keyPos && pNr === keyPos.r && pNc === keyPos.c) {
                    willHaveKey = true;
                }

                if (pNr === goal.r && pNc === goal.c && !willHaveKey) {
                    continue; // Goal is locked
                }

                // 2. Simulate Shadow Clone Movement (if active in level)
                let nextShadow = null;
                let shadowValid = true;

                if (current.shadow) {
                    let sDr = -dir.dr;
                    let sDc = -dir.dc;

                    if (level.shadowMirror === 'horizontal') {
                        sDr = dir.dr;
                        sDc = -dir.dc;
                    } else if (level.shadowMirror === 'vertical') {
                        sDr = -dir.dr;
                        sDc = dir.dc;
                    }

                    const sNr = current.shadow.r + sDr;
                    const sNc = current.shadow.c + sDc;

                    // Check shadow in bounds
                    if (sNr < 0 || sNr >= rows || sNc < 0 || sNc >= cols) {
                        shadowValid = false;
                    } else {
                        const sNextIdx = this.getIndex(sNr, sNc, cols);
                        // Check if shadow hits wall, void, or active laser
                        if (this.isBitSet(current.mask, sNextIdx) || (current.lasersActive && laserIndices.has(sNextIdx))) {
                            shadowValid = false;
                        } else {
                            nextShadow = { r: sNr, c: sNc };
                        }
                    }
                }

                if (!shadowValid) {
                    continue; // Clone died / collided -> invalid branch
                }

                // 3. Process departure collapse on current positions
                let newMask = current.mask;
                const newDurability = { ...current.durability };

                // Player departure collapse
                const pCurrIdx = this.getIndex(current.player.r, current.player.c, cols);
                if (level.trailCollapse !== false) {
                    if (newDurability[pCurrIdx] !== undefined) {
                        newDurability[pCurrIdx]--;
                        if (newDurability[pCurrIdx] <= 0) {
                            delete newDurability[pCurrIdx];
                            newMask = this.setBit(newMask, pCurrIdx);
                        }
                    } else {
                        newMask = this.setBit(newMask, pCurrIdx);
                    }
                }

                // Shadow departure collapse
                if (current.shadow) {
                    const sCurrIdx = this.getIndex(current.shadow.r, current.shadow.c, cols);
                    if (level.trailCollapse !== false) {
                        if (newDurability[sCurrIdx] !== undefined) {
                            newDurability[sCurrIdx]--;
                            if (newDurability[sCurrIdx] <= 0) {
                                delete newDurability[sCurrIdx];
                                newMask = this.setBit(newMask, sCurrIdx);
                            }
                        } else {
                            newMask = this.setBit(newMask, sCurrIdx);
                        }
                    }
                }

                // 4. Ice Momentum Sliding Physics
                if (iceIndices.has(pNextIdx)) {
                    while (iceIndices.has(pNextIdx)) {
                        // Collapse ice tile we slide through
                        newMask = this.setBit(newMask, pNextIdx);

                        const slideNr = pNr + dir.dr;
                        const slideNc = pNc + dir.dc;

                        if (slideNr < 0 || slideNr >= rows || slideNc < 0 || slideNc >= cols) {
                            break; // Stop at board boundary
                        }

                        const slideIdx = this.getIndex(slideNr, slideNc, cols);
                        if (this.isBitSet(newMask, slideIdx) || (current.lasersActive && laserIndices.has(slideIdx))) {
                            break; // Stop before barrier/laser
                        }

                        pNr = slideNr;
                        pNc = slideNc;
                        pNextIdx = slideIdx;

                        if (keyPos && pNr === keyPos.r && pNc === keyPos.c) {
                            willHaveKey = true;
                        }
                    }
                }

                // 5. Quantum Portals Warp Physics
                if (portalsMap.has(pNextIdx)) {
                    const dest = portalsMap.get(pNextIdx);
                    newMask = this.setBit(newMask, pNextIdx); // Entry portal crumbles
                    pNr = dest.r;
                    pNc = dest.c;
                    pNextIdx = dest.idx;
                }

                // 6. Laser Switch Triggering (by player or shadow stepping on a switch)
                let newLasersActive = current.lasersActive;
                if (switchIndices.has(pNextIdx) || (nextShadow && switchIndices.has(this.getIndex(nextShadow.r, nextShadow.c, cols)))) {
                    newLasersActive = !newLasersActive;
                }

                // 7. Hazard Triggers
                if (level.trapTriggers) {
                    const triggerKey = `${pNr},${pNc}`;
                    const triggeredBlocks = level.trapTriggers[triggerKey];
                    if (triggeredBlocks && Array.isArray(triggeredBlocks)) {
                        for (const tb of triggeredBlocks) {
                            const tbIdx = this.getIndex(tb.r, tb.c, cols);
                            if (tbIdx !== pNextIdx && tbIdx !== this.getIndex(goal.r, goal.c, cols)) {
                                newMask = this.setBit(newMask, tbIdx);
                            }
                        }
                    }
                }

                const stateKey = `${pNr},${pNc}|${nextShadow ? `${nextShadow.r},${nextShadow.c}` : 'none'}|${willHaveKey ? 1 : 0}|${newLasersActive ? 1 : 0}|${newMask.toString()}|${serializeDurability(newDurability)}`;
                if (!visited.has(stateKey)) {
                    visited.add(stateKey);
                    queue.push({
                        player: { r: pNr, c: pNc },
                        shadow: nextShadow,
                        mask: newMask,
                        hasKey: willHaveKey,
                        lasersActive: newLasersActive,
                        durability: newDurability,
                        moves: current.moves + 1,
                        path: [...current.path, { r: pNr, c: pNc }]
                    });
                }
            }
        }

        return {
            solvable: false,
            minMoves: Infinity,
            path: [],
            statesExplored
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrapStepSolver;
} else {
    window.TrapStepSolver = TrapStepSolver;
}
