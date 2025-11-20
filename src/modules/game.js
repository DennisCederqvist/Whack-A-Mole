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
        
        console.log('calling spawnMole() from start()');
        this.spawnMole();
    }

    spawnMole() {
        if (!this.state.running) return;

        const cells = Array.from(this.boardEl.querySelectorAll('.cell'));

        const emptyCells = cells.filter(cell => !cell.querySelector('.mole'));
        if (emptyCells.length === 0) return;

        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellEl = emptyCells[randomIndex];


        const mole = new Mole({
            cellEl,
            ttl: this.getRandomDelay(500, 1500),
            onHit: () => {
                this._activeMoles.delete(mole);
                this.state.score++;
                this.updateHud();

                if (this.state.running){
                    const delay = this.getRandomDelay(200, 1000)
                    setTimeout(() => this.spawnMole(), delay);
                }

            },

            onExpire: () => {
                this._activeMoles.delete(mole);
                this.state.misses++;
                this.updateHud();

                if (this.state.running) {
                    const delay = this.getRandomDelay(200, 1000)
                    setTimeout(() => this.spawnMole(), delay);
                }
            }
        });

        this._activeMoles.add(mole);
        mole.show();

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

}

