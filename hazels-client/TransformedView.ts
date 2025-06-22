import { type Point } from './TreeNode';

export class TransformedViewElement extends HTMLElement {
    static minScale = 0.2;
    static maxScale = 3;

    private container!: HTMLDivElement;
    private content!: HTMLElement;
    private scale = 1;
    
    private _isPanning = false;
    private _position: Point = { x: 0, y: 0 };
    private _lastPosition: Point = { x: 0, y: 0 };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.render();
    }

    connectedCallback() {
        while (this.childNodes.length > 0) {
            this.content.appendChild(this.childNodes[0]);
        }
        this.updateTransform();

        this.container.addEventListener('mousedown', this.onMouseDown);
        this.container.addEventListener('wheel', this.onWheel, { passive: false });
    }

    disconnectedCallback() {
        this.container.removeEventListener('mousedown', this.onMouseDown);
        this.container.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }

    screenToWorld(point: Point): Point {
        return {
            x: (point.x - this._position.x) / this.scale,
            y: (point.y - this._position.y) / this.scale
        };
    }

    worldToScreen(point: Point): Point {
        return {
            x: point.x * this.scale + this._position.x,
            y: point.y * this.scale + this._position.y
        };
    }

    private onMouseDown(e: MouseEvent) {
        let el = e.target as HTMLElement | null;
        // don't pan if already interacting with a node header! 
        while (el) {
            if (el.classList && Array.from(el.classList).some(cls => cls.includes('node'))) {
                return;
            }
            el = el.parentElement;
        }

        this._isPanning = true;
        this._lastPosition = { x: e.clientX - this._position.x, y: e.clientY - this._position.y };
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this.container.style.cursor = 'grabbing';
    }

    private onMouseMove(e: MouseEvent) {
        if (!this._isPanning) {
            return;
        }
        this._position.x = e.clientX - this._lastPosition.x;
        this._position.y = e.clientY - this._lastPosition.y;
        this.updateTransform();
    }

    private onMouseUp() {
        this._isPanning = false;
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        this.container.style.cursor = 'default';
    }

    private onWheel(e: WheelEvent) {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(TransformedViewElement.maxScale, Math.max(TransformedViewElement.minScale, this.scale + scaleAmount));

        const rect = this.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = mouseX - this._position.x;
        const dy = mouseY - this._position.y;
        const ratio = newScale / this.scale;

        this._position.x = mouseX - dx * ratio;
        this._position.y = mouseY - dy * ratio;
        this.scale = newScale;
        this.updateTransform();
    }

    private updateTransform() {
        this.content.style.transform = `translate(${this._position.x}px, ${this._position.y}px) scale(${this.scale})`;
    }

    private render() {
        if (!this.shadowRoot) {
            return;
        }
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./TransformedView.css">  
            <div class="container">
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
        this.container = this.shadowRoot.querySelector('.container') as HTMLDivElement;
        this.content = this.shadowRoot.querySelector('.content') as HTMLElement;
    }
}

customElements.define('transformed-view', TransformedViewElement);
