import { Mole } from './mole.js';

export class Game {
    constructor({boardEl, scoreEl, timeEl, missesEl}) {
        this.boardEl = boardEl;
        this.scoreEl = scoreEl;
        this.timeEl = timeEl;
        this.missesEl = missesEl;

        this.gridSize = 3;
        this.duration = 60;

        this.state = {
            score: 0,
            misses: 0,
            timeLeft: this.duration,
            running: false,
    };

    this._tickId = null;
    this._spawnId = null;
    this._activeMoles = new Set();

    this.handleBoardClick = this.handleBoardClick.bind(this);

    }

    init() {
    this.createGrid(this.gridSize);
    this.updateHud();

    this.boardEl.addEventListener('click', this.handleBoardClick);
    this.boardEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') this.handleBoardClick(e);
        });
    }

    createGrid(size = 3) {
        this.boardEl.innerHTML = '';
        for (let i = 0; i < size * size; i++){
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cell';
            cell.setAttribute('aria-label', `Hål ${i + 1}`);
            this.boardEl.appendChild(cell);
        }
    }

    updateHud() {
        this.scoreEl.textContent = `Poäng: ${this.state.score}`;
        this.timeEl.textContent = `Tid: ${this.state.timeLeft}`;
        this.missesEl.textContent = `Missar: ${this.state.misses}`;
    }

    getRandomDelay(min = 200, max = 1000) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getMaxActiveMoles() {
        if (this.state.score >= 30) return 3;
        if (this.state.score >= 10) return 2;
        return 1;
    }


    start() {

        console.log('start() called')

        if (this.state.running) {
            console.log('Game already running, ignoring start()')
            return;
        }

        this.state.score = 0;
        this.state.misses = 0;
        this.state.timeLeft = this.duration;
        this.state.running = true;

        this.updateHud();

        this.startTimer();
        
        console.log('calling spawnMole() from start()');
        this.spawnMole();
    }

    // spawnMole() {
    //     if (!this.state.running) return;

    //     const cells = Array.from(this.boardEl.querySelectorAll('.cell'));

    //     const emptyCells = cells.filter(cell => !cell.querySelector('.mole'));
    //     if (emptyCells.length === 0) return;

    //     const randomIndex = Math.floor(Math.random() * emptyCells.length);
    //     const cellEl = emptyCells[randomIndex];


    //     const mole = new Mole({
    //     cellEl,
    //     ttl: this.getRandomDelay(500, 1500),

    //     onHit: () => {
    //         this._activeMoles.delete(mole);
    //         this.state.score++;
    //         this.updateHud();

    //         if (this.state.running) {
    //             const delay = this.getRandomDelay(200, 1000);

    //             // rensa ev. gammal spawn-timeout
    //             if (this._spawnId !== null) {
    //                 clearTimeout(this._spawnId);
    //                 this._spawnId = null;
    //             }

    //             this._spawnId = setTimeout(() => {
    //                 this._spawnId = null; // städa bort ID:t

    //                 if (this.state.running) {
    //                     this.spawnMole();
    //                 }
    //             }, delay);
    //         }
    //     },

    //     onExpire: () => {
    //         this._activeMoles.delete(mole);
    //         this.state.misses++;
    //         this.updateHud();

    //         if (this.state.running) {
    //             const delay = this.getRandomDelay(200, 1000);

    //             if (this._spawnId !== null) {
    //                 clearTimeout(this._spawnId);
    //                 this._spawnId = null;
    //             }

    //             this._spawnId = setTimeout(() => {
    //                 this._spawnId = null;

    //                 if (this.state.running) {
    //                     this.spawnMole();
    //                 }
    //             }, delay);
    //         }
    //     }
    // });

    //     this._activeMoles.add(mole);
    //     mole.show();

    // }

    spawnMole() {
        if (!this.state.running) return;

        const cells = Array.from(this.boardEl.querySelectorAll('.cell'));
        const emptyCells = cells.filter(cell => !cell.querySelector('.mole'));

        // hur många mullvadar vill vi ha totalt?
        const maxMoles = this.getMaxActiveMoles();

        // hur många har vi redan?
        const currentMoles = this._activeMoles.size;

        // hur många nya vi "får" spawna just nu
        const toSpawn = Math.min(
            maxMoles - currentMoles,
            emptyCells.length
        );

        if (toSpawn <= 0) return; // redan fullt, eller inga tomma rutor

        // spawna 'toSpawn' stycken nya mullvadar i slumpade tomma rutor
        let availableCells = [...emptyCells];

        for (let i = 0; i < toSpawn; i++) {
            const randomIndex = Math.floor(Math.random() * availableCells.length);
            const cellEl = availableCells.splice(randomIndex, 1)[0];

            const mole = new Mole({
                cellEl,
                ttl: this.getRandomDelay(500, 1500),

                onHit: () => {
                    this._activeMoles.delete(mole);
                    this.state.score++;
                    this.updateHud();

                    if (this.state.running) {
                        const delay = this.getRandomDelay(200, 1000);
                        setTimeout(() => this.spawnMole(), delay);
                    }
                },

                onExpire: () => {
                    this._activeMoles.delete(mole);
                    this.state.misses++;
                    this.updateHud();

                    if (this.state.running) {
                        const delay = this.getRandomDelay(200, 1000);
                        setTimeout(() => this.spawnMole(), delay);
                    }
                }
            });

            this._activeMoles.add(mole);
            mole.show();
        }
    }


    handleBoardClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell) return;
        if (!this.state.running) return;

        const activeMole = [...this._activeMoles].find(
            (mole) => mole.cellEl === cell);

        if (activeMole) {
            activeMole.hit();
        } else {
            this.state.misses++;
            this.updateHud();
        }

    }

   startTimer() {
        if (this._tickId !== null) {
            clearInterval(this._tickId);
            this._tickId = null;
        }

        this._tickId = setInterval(() => {
            if (!this.state.running) {
                clearInterval(this._tickId);
                this._tickId = null;
                return;
            }

            this.state.timeLeft--;
            if (this.state.timeLeft < 0) {
                this.state.timeLeft = 0;
            }
            this.updateHud();

            if (this.state.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    reset() {
        if (this._tickId !== null){
            clearInterval(this._tickId);
            this._tickId = null;
        }
        
        if (this._spawnId !== null) {
            clearTimeout(this._spawnId);
            this._spawnId = null;
        }

        this.state.running = false;

        for (const mole of this._activeMoles) {
            mole.hide();
        }

        this.state.score = 0;
        this.state.misses = 0;
        this.state.timeLeft = this.duration;

        this.updateHud();

    }


    endGame() {
        this.state.running = false;

        if (this._tickId !== null) {
            clearInterval(this._tickId);
            this._tickId = null;
        }

        for (const mole of this._activeMoles) {
            mole.hide();
        }

        this._activeMoles.clear();

        this.state.timeLeft = 0;
        this.updateHud();

        const finalScore = this.state.score - this.state.misses;

        alert(
            `GAME OVER!\n\n` +
            `Poäng: ${this.state.score}\n` +
            `Missar: ${this.state.misses}\n` +
            `Slutpoäng: ${finalScore}`
        );
    }

}

