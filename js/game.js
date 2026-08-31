/**
 * TRAPSTEP: ABYSS PROTOCOL - Hardcore Core Game Engine
 * Features: Shadow Clones, Ice Momentum Physics, Quantum Portals, Laser Gates, Switches, Keys, and 2-Step Bridges.
 */

class TrapStepGame {
    constructor() {
        // State
        this.levelIndex = 0;
        this.activeLevel = null;
        this.isEndless = false;
        this.gameState = 'IDLE'; // IDLE, PLAYING, WON, LOST

        this.playerPos = { r: 0, c: 0 };
        this.shadowPos = null;
        this.gridState = []; // 2D array of tile types
        this.durabilityMap = {}; // "r,c" -> steps left
        this.hasKey = false;
        this.lasersActive = true;
        this.movesCount = 0;
        this.remainingMoves = null;

        // Mechanics references
        this.iceSet = new Set();
        this.portalsMap = new Map();
        this.laserGatesSet = new Set();
        this.switchesSet = new Set();

        // Timer
        this.timeRemaining = null;
        this.timerInterval = null;
        this.levelStartTime = null;
        this.elapsedTime = 0;

        // Storage
        this.unlockedLevel = 1;
        this.levelStats = {};
        this.theme = 'dark';

        // DOM elements
        this.boardWrapper = document.getElementById('boardWrapper');
        this.gameBoard = document.getElementById('gameBoard');
        this.playerToken = document.getElementById('playerToken');
        this.shadowToken = document.getElementById('shadowToken');

        // HUD elements
        this.levelBadge = document.getElementById('levelBadge');
        this.levelTitle = document.getElementById('levelTitle');
        this.levelSubtitle = document.getElementById('levelSubtitle');
        this.movesValue = document.getElementById('movesValue');
        this.movesItem = document.getElementById('movesItem');
        this.remainingMovesItem = document.getElementById('remainingMovesItem');
        this.remainingMovesValue = document.getElementById('remainingMovesValue');
        this.timerItem = document.getElementById('timerItem');
        this.timerValue = document.getElementById('timerValue');
        this.timerBarWrapper = document.getElementById('timerBarWrapper');
        this.timerBarFill = document.getElementById('timerBarFill');
        this.tutorialBanner = document.getElementById('tutorialBanner');
        this.tutorialText = document.getElementById('tutorialText');

        // Modals
        this.winModal = document.getElementById('winModal');
        this.loseModal = document.getElementById('loseModal');
        this.levelModal = document.getElementById('levelModal');
        this.helpModal = document.getElementById('helpModal');

        // Confetti Canvas
        this.confettiCanvas = document.getElementById('confettiCanvas');
        this.confettiCtx = this.confettiCanvas.getContext('2d');
        this.confettiParticles = [];
        this.confettiAnimationId = null;

        this.loadSavedData();
        this.initEventListeners();
        this.initTheme();
        this.startLevel(this.levelIndex);
    }

    /* -------------------------------------------------------------------------- */
    /* Persistence & Storage                                                      */
    /* -------------------------------------------------------------------------- */
    loadSavedData() {
        try {
            const savedUnlocked = localStorage.getItem('trapstep_unlocked_level');
            if (savedUnlocked) {
                this.unlockedLevel = parseInt(savedUnlocked, 10) || 1;
            }

            const savedStats = localStorage.getItem('trapstep_level_stats');
            if (savedStats) {
                this.levelStats = JSON.parse(savedStats) || {};
            }

            const savedTheme = localStorage.getItem('trapstep_theme');
            if (savedTheme) {
                this.theme = savedTheme;
            }
        } catch (e) {
            console.warn('LocalStorage unavailable or corrupted', e);
        }
    }

    saveProgress(levelId, stars, moves, time) {
        try {
            if (!this.levelStats[levelId]) {
                this.levelStats[levelId] = { stars, bestMoves: moves, bestTime: time };
            } else {
                const prev = this.levelStats[levelId];
                this.levelStats[levelId] = {
                    stars: Math.max(prev.stars || 0, stars),
                    bestMoves: Math.min(prev.bestMoves || Infinity, moves),
                    bestTime: Math.min(prev.bestTime || Infinity, time)
                };
            }
            localStorage.setItem('trapstep_level_stats', JSON.stringify(this.levelStats));

            if (typeof levelId === 'number' && levelId >= this.unlockedLevel && levelId < LEVELS.length) {
                this.unlockedLevel = levelId + 1;
                localStorage.setItem('trapstep_unlocked_level', this.unlockedLevel.toString());
            }
        } catch (e) {
            console.warn('Error saving progress', e);
        }
    }

    resetAllProgress() {
        if (confirm('Are you sure you want to reset all game progress and best scores?')) {
            localStorage.removeItem('trapstep_unlocked_level');
            localStorage.removeItem('trapstep_level_stats');
            this.unlockedLevel = 1;
            this.levelStats = {};
            this.levelIndex = 0;
            this.startLevel(0);
        }
    }

    /* -------------------------------------------------------------------------- */
    /* Theme & Sound Controls                                                     */
    /* -------------------------------------------------------------------------- */
    initTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.textContent = this.theme === 'dark' ? '🌙' : '☀️';
        }
        const soundBtn = document.getElementById('soundToggleBtn');
        if (soundBtn) {
            soundBtn.textContent = window.soundEngine.enabled ? '🔊' : '🔇';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('trapstep_theme', this.theme);
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.textContent = this.theme === 'dark' ? '🌙' : '☀️';
        }
        window.soundEngine.playClick();
    }

    toggleSound() {
        const enabled = window.soundEngine.toggle();
        const soundBtn = document.getElementById('soundToggleBtn');
        if (soundBtn) {
            soundBtn.textContent = enabled ? '🔊' : '🔇';
        }
    }

    /* -------------------------------------------------------------------------- */
    /* Level Initialization & Board Rendering                                     */
    /* -------------------------------------------------------------------------- */
    startLevel(indexOrConfig) {
        this.stopTimer();
        this.stopConfetti();
        this.closeAllModals();

        if (typeof indexOrConfig === 'number') {
            this.isEndless = false;
            this.levelIndex = indexOrConfig;
            this.activeLevel = JSON.parse(JSON.stringify(LEVELS[this.levelIndex]));
        } else {
            this.isEndless = true;
            this.activeLevel = JSON.parse(JSON.stringify(indexOrConfig));
        }

        const lvl = this.activeLevel;
        this.playerPos = { r: lvl.start.r, c: lvl.start.c };
        this.shadowPos = lvl.shadowStart ? { r: lvl.shadowStart.r, c: lvl.shadowStart.c } : null;
        this.movesCount = 0;
        this.elapsedTime = 0;
        this.gameState = 'PLAYING';
        this.hasKey = !lvl.key;
        this.durabilityMap = {};
        this.iceSet = new Set();
        this.portalsMap = new Map();
        this.laserGatesSet = new Set();
        this.switchesSet = new Set();
        this.lasersActive = lvl.laserGates ? (lvl.initialLasersActive !== false) : false;

        // Constraints
        this.remainingMoves = lvl.maxMoves !== null ? lvl.maxMoves : null;
        this.timeRemaining = lvl.timeLimit !== null ? lvl.timeLimit : null;

        // Initialize 2D grid matrix
        this.gridState = [];
        for (let r = 0; r < lvl.rows; r++) {
            const row = [];
            for (let c = 0; c < lvl.cols; c++) {
                row.push('walkable');
            }
            this.gridState.push(row);
        }

        // Walls
        if (lvl.walls) {
            for (const w of lvl.walls) {
                if (w.r >= 0 && w.r < lvl.rows && w.c >= 0 && w.c < lvl.cols) {
                    this.gridState[w.r][w.c] = 'wall';
                }
            }
        }

        // Ice Tiles
        if (lvl.iceTiles) {
            for (const it of lvl.iceTiles) {
                this.gridState[it.r][it.c] = 'ice';
                this.iceSet.add(`${it.r},${it.c}`);
            }
        }

        // Portals
        if (lvl.portals && lvl.portals.length >= 2) {
            const pA = lvl.portals[0];
            const pB = lvl.portals[1];
            this.gridState[pA.r][pA.c] = 'portal-a';
            this.gridState[pB.r][pB.c] = 'portal-b';
            this.portalsMap.set(`${pA.r},${pA.c}`, { r: pB.r, c: pB.c });
            this.portalsMap.set(`${pB.r},${pB.c}`, { r: pA.r, c: pA.c });
        }

        // Laser Gates & Switches
        if (lvl.laserGates) {
            for (const lg of lvl.laserGates) {
                this.gridState[lg.r][lg.c] = 'laser-gate';
                this.laserGatesSet.add(`${lg.r},${lg.c}`);
            }
        }
        if (lvl.switches) {
            for (const sw of lvl.switches) {
                this.gridState[sw.r][sw.c] = 'switch';
                this.switchesSet.add(`${sw.r},${sw.c}`);
            }
        }

        // Multi-Step Bridges
        if (lvl.multiStepTiles) {
            for (const mst of lvl.multiStepTiles) {
                this.gridState[mst.r][mst.c] = 'multistep';
                this.durabilityMap[`${mst.r},${mst.c}`] = mst.steps || 2;
            }
        }

        // Key, Start, Goal
        if (lvl.key) {
            this.gridState[lvl.key.r][lvl.key.c] = 'key';
        }
        this.gridState[lvl.start.r][lvl.start.c] = 'start';
        this.gridState[lvl.goal.r][lvl.goal.c] = 'goal';

        // Hazards
        if (lvl.trapTriggers) {
            for (const key of Object.keys(lvl.trapTriggers)) {
                const [tr, tc] = key.split(',').map(Number);
                if (this.gridState[tr] && this.gridState[tr][tc] === 'walkable') {
                    this.gridState[tr][tc] = 'hazard';
                }
            }
        }

        this.renderBoard();
        this.updateHUD();
        this.updatePlayerTokenPosition(false);
        this.updateShadowTokenPosition(false);
        this.updateValidNeighborHighlights();

        if (this.timeRemaining !== null) {
            this.startTimer();
        }

        this.levelStartTime = performance.now();
    }

    renderBoard() {
        const lvl = this.activeLevel;
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.setProperty('--cols', lvl.cols);
        this.gameBoard.style.setProperty('--rows', lvl.rows);

        this.boardWrapper.style.setProperty('--cols', lvl.cols);
        this.boardWrapper.style.setProperty('--rows', lvl.rows);

        for (let r = 0; r < lvl.rows; r++) {
            for (let c = 0; c < lvl.cols; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.r = r;
                tile.dataset.c = c;

                const type = this.gridState[r][c];
                if (type === 'start') tile.classList.add('tile-start');
                else if (type === 'goal') {
                    tile.classList.add('tile-goal');
                    if (!this.hasKey) tile.classList.add('tile-locked');
                }
                else if (type === 'key') tile.classList.add('tile-key');
                else if (type === 'ice') tile.classList.add('tile-ice');
                else if (type === 'portal-a') tile.classList.add('tile-portal-a');
                else if (type === 'portal-b') tile.classList.add('tile-portal-b');
                else if (type === 'laser-gate') {
                    tile.classList.add('tile-laser-gate');
                    if (this.lasersActive) tile.classList.add('active');
                }
                else if (type === 'switch') tile.classList.add('tile-switch');
                else if (type === 'multistep') {
                    tile.classList.add('tile-multistep');
                    tile.dataset.steps = this.durabilityMap[`${r},${c}`] || 2;
                }
                else if (type === 'wall') tile.classList.add('tile-wall');
                else if (type === 'hazard') tile.classList.add('tile-hazard');
                else if (type === 'collapsed') tile.classList.add('tile-collapsed');

                tile.addEventListener('click', () => {
                    this.handleTileClick(r, c);
                });

                this.gameBoard.appendChild(tile);
            }
        }
    }

    updatePlayerTokenPosition(animate = true) {
        const targetTile = this.gameBoard.querySelector(`.tile[data-r="${this.playerPos.r}"][data-c="${this.playerPos.c}"]`);
        if (!targetTile) {
            requestAnimationFrame(() => this.updatePlayerTokenPosition(animate));
            return;
        }

        const tileRect = targetTile.getBoundingClientRect();
        const boardRect = this.boardWrapper.getBoundingClientRect();

        if (tileRect.width === 0 || boardRect.width === 0) {
            requestAnimationFrame(() => this.updatePlayerTokenPosition(animate));
            return;
        }

        const x = tileRect.left - boardRect.left;
        const y = tileRect.top - boardRect.top;

        this.playerToken.style.width = `${tileRect.width}px`;
        this.playerToken.style.height = `${tileRect.height}px`;
        this.playerToken.style.transform = `translate3d(${x}px, ${y}px, 0)`;

        if (animate) {
            this.playerToken.classList.add('moving');
            setTimeout(() => this.playerToken.classList.remove('moving'), 180);
        }
    }

    updateShadowTokenPosition(animate = true) {
        if (!this.shadowPos) {
            this.shadowToken.classList.remove('active');
            return;
        }

        this.shadowToken.classList.add('active');
        const targetTile = this.gameBoard.querySelector(`.tile[data-r="${this.shadowPos.r}"][data-c="${this.shadowPos.c}"]`);
        if (!targetTile) {
            requestAnimationFrame(() => this.updateShadowTokenPosition(animate));
            return;
        }

        const tileRect = targetTile.getBoundingClientRect();
        const boardRect = this.boardWrapper.getBoundingClientRect();

        if (tileRect.width === 0 || boardRect.width === 0) {
            requestAnimationFrame(() => this.updateShadowTokenPosition(animate));
            return;
        }

        const x = tileRect.left - boardRect.left;
        const y = tileRect.top - boardRect.top;

        this.shadowToken.style.width = `${tileRect.width}px`;
        this.shadowToken.style.height = `${tileRect.height}px`;
        this.shadowToken.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    updateValidNeighborHighlights() {
        const lvl = this.activeLevel;
        const tiles = this.gameBoard.querySelectorAll('.tile');
        tiles.forEach(t => t.classList.remove('tile-valid-neighbor'));

        if (this.gameState !== 'PLAYING') return;

        const dirs = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 }
        ];

        dirs.forEach(dir => {
            const nr = this.playerPos.r + dir.dr;
            const nc = this.playerPos.c + dir.dc;
            if (this.isValidMove(nr, nc)) {
                const targetTile = this.gameBoard.querySelector(`.tile[data-r="${nr}"][data-c="${nc}"]`);
                if (targetTile) {
                    targetTile.classList.add('tile-valid-neighbor');
                }
            }
        });
    }

    updateHUD() {
        const lvl = this.activeLevel;

        if (this.isEndless) {
            this.levelBadge.textContent = 'ENDLESS';
            this.levelTitle.textContent = lvl.title;
            this.levelSubtitle.textContent = lvl.subtitle;
        } else {
            this.levelBadge.textContent = `LVL ${lvl.id}`;
            this.levelTitle.textContent = lvl.title;
            this.levelSubtitle.textContent = lvl.subtitle;
        }

        this.movesValue.textContent = this.movesCount;

        // Move Limit Display
        if (this.remainingMoves !== null) {
            this.remainingMovesItem.style.display = 'flex';
            this.remainingMovesValue.textContent = this.remainingMoves;
            if (this.remainingMoves <= 3) {
                this.remainingMovesValue.classList.add('limit-warning');
            } else {
                this.remainingMovesValue.classList.remove('limit-warning');
            }
        } else {
            this.remainingMovesItem.style.display = 'none';
        }

        // Timer Display
        if (this.timeRemaining !== null) {
            this.timerItem.style.display = 'flex';
            this.timerBarWrapper.classList.add('active');
            this.timerValue.textContent = `${this.timeRemaining.toFixed(1)}s`;

            const percentage = (this.timeRemaining / lvl.timeLimit) * 100;
            this.timerBarFill.style.width = `${Math.max(0, percentage)}%`;

            if (this.timeRemaining <= 5) {
                this.timerValue.classList.add('limit-warning');
                this.timerBarFill.classList.add('urgent');
            } else {
                this.timerValue.classList.remove('limit-warning');
                this.timerBarFill.classList.remove('urgent');
            }
        } else {
            this.timerItem.style.display = 'none';
            this.timerBarWrapper.classList.remove('active');
        }

        // Tutorial banner
        if (lvl.tutorial && lvl.tutorial.length > 0) {
            this.tutorialBanner.classList.remove('hidden');
            this.tutorialText.textContent = lvl.tutorial[0];
        } else {
            this.tutorialBanner.classList.add('hidden');
        }
    }

    /* -------------------------------------------------------------------------- */
    /* Timer Management                                                           */
    /* -------------------------------------------------------------------------- */
    startTimer() {
        this.stopTimer();
        let lastTime = performance.now();

        this.timerInterval = setInterval(() => {
            if (this.gameState !== 'PLAYING') return;

            const now = performance.now();
            const delta = (now - lastTime) / 1000;
            lastTime = now;

            this.timeRemaining = Math.max(0, this.timeRemaining - delta);
            this.updateHUD();

            if (this.timeRemaining <= 4.0 && this.timeRemaining > 0) {
                const prevSec = Math.ceil(this.timeRemaining + delta);
                const curSec = Math.ceil(this.timeRemaining);
                if (prevSec !== curSec) {
                    window.soundEngine.playTick(true);
                }
            }

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.handleLoss('Time Expired! The board destabilized.');
            }
        }, 80);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /* -------------------------------------------------------------------------- */
    /* Movement Physics & Hardcore State Transitions                              */
    /* -------------------------------------------------------------------------- */
    isValidMove(targetR, targetC) {
        const lvl = this.activeLevel;
        if (targetR < 0 || targetR >= lvl.rows || targetC < 0 || targetC >= lvl.cols) {
            return false;
        }

        const type = this.gridState[targetR][targetC];
        if (type === 'wall' || type === 'collapsed') {
            return false;
        }

        // Check if Goal is locked
        if (targetR === lvl.goal.r && targetC === lvl.goal.c && !this.hasKey) {
            return false;
        }

        // Check if Laser Gate is active
        if (this.lasersActive && this.laserGatesSet.has(`${targetR},${targetC}`)) {
            return false;
        }

        return true;
    }

    handleTileClick(r, c) {
        if (this.gameState !== 'PLAYING') return;

        const dr = r - this.playerPos.r;
        const dc = c - this.playerPos.c;

        if (Math.abs(dr) + Math.abs(dc) === 1) {
            let dir = null;
            if (dr === -1) dir = 'UP';
            else if (dr === 1) dir = 'DOWN';
            else if (dc === -1) dir = 'LEFT';
            else if (dc === 1) dir = 'RIGHT';

            if (dir) this.move(dir);
        }
    }

    move(direction) {
        if (this.gameState !== 'PLAYING') return;

        let dr = 0;
        let dc = 0;

        switch (direction) {
            case 'UP': dr = -1; break;
            case 'DOWN': dr = 1; break;
            case 'LEFT': dc = -1; break;
            case 'RIGHT': dc = 1; break;
            default: return;
        }

        let nextR = this.playerPos.r + dr;
        let nextC = this.playerPos.c + dc;

        if (!this.isValidMove(nextR, nextC)) {
            return;
        }

        // 1. Calculate Shadow Movement (if active)
        let nextShadow = null;
        if (this.shadowPos) {
            let sDr = -dr;
            let sDc = -dc;
            if (this.activeLevel.shadowMirror === 'horizontal') {
                sDr = dr;
                sDc = -dc;
            } else if (this.activeLevel.shadowMirror === 'vertical') {
                sDr = -dr;
                sDc = dc;
            }

            const sNr = this.shadowPos.r + sDr;
            const sNc = this.shadowPos.c + sDc;

            // Check shadow in-bounds and collision
            if (sNr < 0 || sNr >= this.activeLevel.rows || sNc < 0 || sNc >= this.activeLevel.cols) {
                this.handleLoss('Your Shadow Clone moved out of bounds and was lost to the void!');
                return;
            }

            const sType = this.gridState[sNr][sNc];
            if (sType === 'wall' || sType === 'collapsed') {
                this.handleLoss('Your Shadow Clone crashed into a collapsed void tile!');
                return;
            }

            if (this.lasersActive && this.laserGatesSet.has(`${sNr},${sNc}`)) {
                this.handleLoss('Your Shadow Clone was incinerated by an active laser gate!');
                return;
            }

            nextShadow = { r: sNr, c: sNc };
        }

        const prevPlayerPos = { r: this.playerPos.r, c: this.playerPos.c };
        const prevShadowPos = this.shadowPos ? { r: this.shadowPos.r, c: this.shadowPos.c } : null;

        this.movesCount++;
        if (this.remainingMoves !== null) {
            this.remainingMoves--;
        }

        // 2. Collapse Departure Tiles
        if (this.activeLevel.trailCollapse !== false) {
            this.processTileDeparture(prevPlayerPos.r, prevPlayerPos.c);
            if (prevShadowPos) {
                this.processTileDeparture(prevShadowPos.r, prevShadowPos.c);
            }
        }

        // 3. Ice Sliding Momentum Physics
        if (this.gridState[nextR][nextC] === 'ice') {
            window.soundEngine.playIceSlide();
            while (this.gridState[nextR][nextC] === 'ice') {
                this.collapseTile(nextR, nextC); // Traversed ice collapses

                const slideR = nextR + dr;
                const slideC = nextC + dc;

                if (slideR < 0 || slideR >= this.activeLevel.rows || slideC < 0 || slideC >= this.activeLevel.cols) {
                    break;
                }

                const targetType = this.gridState[slideR][slideC];
                if (targetType === 'wall' || targetType === 'collapsed' || (this.lasersActive && this.laserGatesSet.has(`${slideR},${slideC}`))) {
                    break;
                }

                nextR = slideR;
                nextC = slideC;

                if (this.gridState[nextR][nextC] === 'key') {
                    this.collectKey(nextR, nextC);
                }
            }
        }

        // 4. Quantum Portal Teleportation
        const portalKey = `${nextR},${nextC}`;
        if (this.portalsMap.has(portalKey)) {
            const dest = this.portalsMap.get(portalKey);
            this.collapseTile(nextR, nextC); // Entry portal crumbles
            nextR = dest.r;
            nextC = dest.c;
            window.soundEngine.playPortal();
        }

        // Update positions
        this.playerPos = { r: nextR, c: nextC };
        this.shadowPos = nextShadow;

        window.soundEngine.playStep();
        if (this.shadowPos) window.soundEngine.playCloneStep();

        // 5. Check Key Collection
        if (this.gridState[nextR][nextC] === 'key') {
            this.collectKey(nextR, nextC);
        }

        // 6. Laser Switch Triggering (by player or shadow clone)
        const pOnSwitch = this.switchesSet.has(`${nextR},${nextC}`);
        const sOnSwitch = this.shadowPos && this.switchesSet.has(`${this.shadowPos.r},${this.shadowPos.c}`);
        if (pOnSwitch || sOnSwitch) {
            this.toggleLasers();
        }

        // 7. Hazard Trap Triggers
        const triggerKey = `${nextR},${nextC}`;
        if (this.activeLevel.trapTriggers && this.activeLevel.trapTriggers[triggerKey]) {
            const targets = this.activeLevel.trapTriggers[triggerKey];
            for (const t of targets) {
                if (
                    !(t.r === this.playerPos.r && t.c === this.playerPos.c) &&
                    !(t.r === this.activeLevel.goal.r && t.c === this.activeLevel.goal.c)
                ) {
                    this.collapseTile(t.r, t.c);
                }
            }
            window.soundEngine.playTrap();
        }

        // Update UI
        this.updatePlayerTokenPosition(true);
        this.updateShadowTokenPosition(true);
        this.updateHUD();
        this.updateValidNeighborHighlights();

        // Check Win Condition
        if (this.playerPos.r === this.activeLevel.goal.r && this.playerPos.c === this.activeLevel.goal.c && this.hasKey) {
            this.handleWin();
            return;
        }

        // Check Move Limit Depletion
        if (this.remainingMoves !== null && this.remainingMoves <= 0) {
            this.handleLoss('Out of Energy Steps! No moves remaining.');
            return;
        }

        // Check Immediate Enclosure / Deadlock
        if (!this.hasLegalMoves()) {
            this.handleLoss('Trapped! The surrounding floor has collapsed.');
            return;
        }
    }

    collectKey(r, c) {
        this.hasKey = true;
        this.gridState[r][c] = 'walkable';
        const keyTile = this.gameBoard.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
        if (keyTile) keyTile.classList.remove('tile-key');

        const goalTile = this.gameBoard.querySelector(`.tile[data-r="${this.activeLevel.goal.r}"][data-c="${this.activeLevel.goal.c}"]`);
        if (goalTile) goalTile.classList.remove('tile-locked');

        window.soundEngine.playKey();
    }

    toggleLasers() {
        this.lasersActive = !this.lasersActive;
        window.soundEngine.playSwitch();

        this.laserGatesSet.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            const tile = this.gameBoard.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
            if (tile) {
                if (this.lasersActive) {
                    tile.classList.add('active');
                } else {
                    tile.classList.remove('active');
                }
            }
        });
    }

    processTileDeparture(r, c) {
        const key = `${r},${c}`;
        if (this.durabilityMap[key] !== undefined) {
            this.durabilityMap[key]--;
            const tile = this.gameBoard.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
            if (this.durabilityMap[key] <= 0) {
                delete this.durabilityMap[key];
                this.collapseTile(r, c);
            } else if (tile) {
                tile.dataset.steps = this.durabilityMap[key];
            }
        } else {
            this.collapseTile(r, c);
        }
    }

    collapseTile(r, c) {
        const lvl = this.activeLevel;
        if (r < 0 || r >= lvl.rows || c < 0 || c >= lvl.cols) return;
        if (r === lvl.goal.r && c === lvl.goal.c) return;

        this.gridState[r][c] = 'collapsed';
        const tile = this.gameBoard.querySelector(`.tile[data-r="${r}"][data-c="${c}"]`);
        if (tile) {
            tile.className = 'tile tile-collapsed';
        }
    }

    hasLegalMoves() {
        const dirs = [
            { dr: -1, dc: 0 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 },
            { dr: 0, dc: 1 }
        ];

        return dirs.some(dir => this.isValidMove(this.playerPos.r + dir.dr, this.playerPos.c + dir.dc));
    }

    /* -------------------------------------------------------------------------- */
    /* Win & Loss Handling                                                        */
    /* -------------------------------------------------------------------------- */
    handleWin() {
        this.gameState = 'WON';
        this.stopTimer();

        const duration = (performance.now() - this.levelStartTime) / 1000;
        window.soundEngine.playWin();
        this.triggerConfetti();

        let stars = 3;
        const starString = '★★★';
        document.getElementById('winStars').textContent = starString;
        document.getElementById('winMoves').textContent = this.movesCount;
        document.getElementById('winTime').textContent = `${duration.toFixed(1)}s`;

        const levelId = this.isEndless ? 'endless' : this.activeLevel.id;
        this.saveProgress(levelId, stars, this.movesCount, duration);

        const best = this.levelStats[levelId] || { bestMoves: this.movesCount, bestTime: duration };
        document.getElementById('winBestMoves').textContent = best.bestMoves;
        document.getElementById('winBestTime').textContent = `${best.bestTime.toFixed(1)}s`;

        const nextBtn = document.getElementById('winNextBtn');
        if (this.isEndless || this.levelIndex >= LEVELS.length - 1) {
            nextBtn.textContent = 'Next Challenge ➔';
        } else {
            nextBtn.textContent = `Level ${this.levelIndex + 2} ➔`;
        }

        setTimeout(() => {
            this.winModal.classList.add('active');
        }, 300);
    }

    handleLoss(reason) {
        this.gameState = 'LOST';
        this.stopTimer();

        window.soundEngine.playLose();
        this.playerToken.classList.add('trapped');

        document.getElementById('loseReason').textContent = reason;
        document.getElementById('loseMoves').textContent = this.movesCount;
        document.getElementById('loseLevel').textContent = this.isEndless ? 'Endless Mode' : `Level ${this.activeLevel.id}`;

        setTimeout(() => {
            this.playerToken.classList.remove('trapped');
            this.loseModal.classList.add('active');
        }, 550);
    }

    /* -------------------------------------------------------------------------- */
    /* Modals & Navigation                                                        */
    /* -------------------------------------------------------------------------- */
    closeAllModals() {
        this.winModal.classList.remove('active');
        this.loseModal.classList.remove('active');
        this.levelModal.classList.remove('active');
        this.helpModal.classList.remove('active');
    }

    showLevelSelect() {
        this.closeAllModals();
        const grid = document.getElementById('levelSelectGrid');
        grid.innerHTML = '';

        LEVELS.forEach((lvl, idx) => {
            const card = document.createElement('div');
            card.className = 'level-card';

            const isLocked = lvl.id > this.unlockedLevel;
            const isCurrent = !this.isEndless && this.levelIndex === idx;

            if (isLocked) card.classList.add('locked');
            if (isCurrent) card.classList.add('current');

            const stats = this.levelStats[lvl.id];
            const starStr = stats ? '★'.repeat(stats.stars) + '☆'.repeat(3 - stats.stars) : '☆☆☆';

            card.innerHTML = `
                <span class="level-card-num">${isLocked ? '🔒' : lvl.id}</span>
                <span class="level-card-stars">${isLocked ? 'Locked' : starStr}</span>
            `;

            if (!isLocked) {
                card.addEventListener('click', () => {
                    this.startLevel(idx);
                });
            }

            grid.appendChild(card);
        });

        this.levelModal.classList.add('active');
        window.soundEngine.playClick();
    }

    showHelpModal() {
        this.closeAllModals();
        this.helpModal.classList.add('active');
        window.soundEngine.playClick();
    }

    nextLevel() {
        if (this.isEndless) {
            const newLevel = LevelGenerator.generate({ rows: 5, cols: 5, difficulty: 'chaos' });
            this.startLevel(newLevel);
        } else if (this.levelIndex < LEVELS.length - 1) {
            this.startLevel(this.levelIndex + 1);
        } else {
            const newLevel = LevelGenerator.generate({ rows: 6, cols: 6, difficulty: 'chaos' });
            this.startLevel(newLevel);
        }
    }

    /* -------------------------------------------------------------------------- */
    /* Event Listeners (Keyboard, Touch, Buttons)                                 */
    /* -------------------------------------------------------------------------- */
    initEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
                return;
            }

            if (e.key === 'r' || e.key === 'R') {
                this.startLevel(this.isEndless ? this.activeLevel : this.levelIndex);
                return;
            }

            switch (e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    e.preventDefault();
                    this.move('UP');
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    e.preventDefault();
                    this.move('DOWN');
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    e.preventDefault();
                    this.move('LEFT');
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    e.preventDefault();
                    this.move('RIGHT');
                    break;
            }
        });

        // Touch Swipe
        let touchStartX = 0;
        let touchStartY = 0;
        const minSwipeDistance = 25;

        this.boardWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        this.boardWrapper.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (Math.abs(dx) > minSwipeDistance) {
                    this.move(dx > 0 ? 'RIGHT' : 'LEFT');
                }
            } else {
                if (Math.abs(dy) > minSwipeDistance) {
                    this.move(dy > 0 ? 'DOWN' : 'UP');
                }
            }
        }, { passive: true });

        // D-Pad
        const dpadBtns = document.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            const dir = btn.dataset.dir;
            const handlePress = (e) => {
                e.preventDefault();
                btn.classList.add('pressed');
                this.move(dir);
                setTimeout(() => btn.classList.remove('pressed'), 120);
            };
            btn.addEventListener('touchstart', handlePress, { passive: false });
            btn.addEventListener('click', handlePress);
        });

        // Top Buttons
        document.getElementById('themeToggleBtn').addEventListener('click', () => this.toggleTheme());
        document.getElementById('soundToggleBtn').addEventListener('click', () => this.toggleSound());
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelpModal());
        document.getElementById('levelSelectBtn').addEventListener('click', () => this.showLevelSelect());

        // Footer Buttons
        document.getElementById('restartBtn').addEventListener('click', () => {
            window.soundEngine.playClick();
            this.startLevel(this.isEndless ? this.activeLevel : this.levelIndex);
        });

        document.getElementById('resetGameBtn').addEventListener('click', () => this.resetAllProgress());

        // Modal Buttons
        document.getElementById('winReplayBtn').addEventListener('click', () => {
            this.startLevel(this.isEndless ? this.activeLevel : this.levelIndex);
        });
        document.getElementById('winNextBtn').addEventListener('click', () => this.nextLevel());

        document.getElementById('loseRetryBtn').addEventListener('click', () => {
            this.startLevel(this.isEndless ? this.activeLevel : this.levelIndex);
        });
        document.getElementById('loseSelectBtn').addEventListener('click', () => this.showLevelSelect());

        document.getElementById('closeLevelModalBtn').addEventListener('click', () => this.closeAllModals());
        document.getElementById('closeHelpModalBtn').addEventListener('click', () => this.closeAllModals());
        document.getElementById('closeHelpBtn2').addEventListener('click', () => this.closeAllModals());

        document.getElementById('playEndlessBtn').addEventListener('click', () => {
            const endlessLevel = LevelGenerator.generate({ rows: 5, cols: 5, difficulty: 'chaos' });
            this.startLevel(endlessLevel);
        });

        // ResizeObserver
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                this.updatePlayerTokenPosition(false);
                this.updateShadowTokenPosition(false);
            });
            ro.observe(this.gameBoard);
        } else {
            window.addEventListener('resize', () => {
                this.updatePlayerTokenPosition(false);
                this.updateShadowTokenPosition(false);
            });
        }
    }

    /* -------------------------------------------------------------------------- */
    /* Confetti Particle System                                                   */
    /* -------------------------------------------------------------------------- */
    triggerConfetti() {
        this.confettiParticles = [];
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.confettiCanvas.width = width;
        this.confettiCanvas.height = height;

        const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'];

        for (let i = 0; i < 90; i++) {
            this.confettiParticles.push({
                x: width * 0.5,
                y: height * 0.45,
                vx: (Math.random() - 0.5) * 14,
                vy: (Math.random() - 0.8) * 16,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                opacity: 1
            });
        }

        const render = () => {
            this.confettiCtx.clearRect(0, 0, width, height);

            let alive = false;
            for (const p of this.confettiParticles) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35;
                p.vx *= 0.98;
                p.rotation += p.rotSpeed;
                p.opacity -= 0.009;

                if (p.opacity > 0 && p.y < height) {
                    alive = true;
                    this.confettiCtx.save();
                    this.confettiCtx.translate(p.x, p.y);
                    this.confettiCtx.rotate((p.rotation * Math.PI) / 180);
                    this.confettiCtx.fillStyle = p.color;
                    this.confettiCtx.globalAlpha = Math.max(0, p.opacity);
                    this.confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    this.confettiCtx.restore();
                }
            }

            if (alive) {
                this.confettiAnimationId = requestAnimationFrame(render);
            } else {
                this.confettiCtx.clearRect(0, 0, width, height);
            }
        };

        if (this.confettiAnimationId) cancelAnimationFrame(this.confettiAnimationId);
        this.confettiAnimationId = requestAnimationFrame(render);
    }

    stopConfetti() {
        if (this.confettiAnimationId) {
            cancelAnimationFrame(this.confettiAnimationId);
            this.confettiAnimationId = null;
        }
        if (this.confettiCtx) {
            this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new TrapStepGame();
});
