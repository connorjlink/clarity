import * as nt from './node_types';

export class TransformedViewElement extends HTMLElement {
    static minScale = 0.2;
    static maxScale = 3;

    private _container!: HTMLDivElement;
    private _scale = 1;
    
    private _isPanning = false;
    private _position: nt.Point = { x: 0, y: 0 };
    private _lastPosition: nt.Point = { x: 0, y: 0 };

    constructor() {
        super();
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onWheel = this.onWheel.bind(this);
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
        this.updateTransform();
        this._container.addEventListener('mousedown', this.onMouseDown);
        this._container.addEventListener('wheel', this.onWheel, { passive: false });
    }

    disconnectedCallback() {
        this._container.removeEventListener('mousedown', this.onMouseDown);
        this._container.removeEventListener('wheel', this.onWheel);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }

    screenToWorld(point: nt.Point): nt.Point {
        return {
            x: (point.x - this._position.x) / this._scale,
            y: (point.y - this._position.y) / this._scale
        };
    }

    worldToScreen(point: nt.Point): nt.Point {
        return {
            x: point.x * this._scale + this._position.x,
            y: point.y * this._scale + this._position.y
        };
    }

    private onMouseDown(e: MouseEvent) {
        let element = e.target as HTMLElement | null;
        // don't pan if already interacting with a node header! 
        while (element) {
            if (element.nodeName.toLowerCase() === 'tree-node') {
                return;
            }
            element = element.parentElement;
        }

        this._isPanning = true;
        this._lastPosition = { x: e.clientX - this._position.x, y: e.clientY - this._position.y };
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this._container.style.cursor = 'grabbing';
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
        this._container.style.cursor = 'grab';
        // default back after stopping panning
        setTimeout(() => {
            if (!this._isPanning) {
                this._container.style.cursor = 'default'
            }
        }, 1000); 
    }

    private onWheel(e: WheelEvent) {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(TransformedViewElement.maxScale, Math.max(TransformedViewElement.minScale, this._scale + scaleAmount));

        const rect = this._container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = mouseX - this._position.x;
        const dy = mouseY - this._position.y;
        const ratio = newScale / this._scale;

        this._position.x = mouseX - dx * ratio;
        this._position.y = mouseY - dy * ratio;
        this._scale = newScale;
        this.updateTransform();
    }

    private updateTransform() {
        this._container.style.transform = `translate3d(${this._position.x}px, ${this._position.y}px, 0) scale(${this._scale})`;
    }

    private render() {
        if (!this.shadowRoot) {
            return;
        }
        // NOTE: ABSOLUTELY HAS TO BE SHADOW ROOT FOR NOW BECAUSE IT USES THE SLOT ELEMENT!
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./TransformedView.css">
            <div class="container">
                <slot name="transformed-view-slot"></slot>
            </div>
        `;
        this._container = this.shadowRoot.querySelector('.container') as HTMLDivElement;
    }
}

customElements.define('transformed-view', TransformedViewElement);
