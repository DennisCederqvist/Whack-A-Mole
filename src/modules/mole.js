export class Mole {
    constructor({cellEl, ttl = 800, onHit, onExpire}) {
        this.cellEl = cellEl;
        this.ttl = ttl;
        this.onHit = onHit;
        this.onExpire = onExpire;
        this._timeoutId = null;
    }

    show() {
        const moleEl = document.createElement('div');
        moleEl.className = 'mole';
        this.cellEl.appendChild(moleEl);
        this._timeoutId = setTimeout (() => {
            this.hide();

            if (typeof this.onExpire === 'function') {
                this.onExpire(this);
            }
        }, this.ttl);
    }

    hide() {
        if (!this.cellEl) return;

        const moleEl = this.cellEl.querySelector('.mole');
        if (moleEl) {
            moleEl.remove();
        }

        if (this._timeoutId !== null) {
            clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }
    }

    hit() {
       if (this._timeoutId !== null) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
       }

       const moleEl = this.cellEl.querySelector('.mole');

       if (moleEl) {
        moleEl.classList.add('hit');
        setTimeout(() => {
            this.hide();

            if (typeof this.onHit === 'function') {
                this.onHit(this);
            }
        }, 150);
       } else {
        this.hide();
        if (typeof this.onHit === 'function') {
            this.onHit(this);
        }
       }

    }

}