export class TransformedViewElement extends HTMLElement {
    private container: HTMLDivElement;
    private content: HTMLElement;
    private position = { x: 0, y: 0 };
    private scale = 1;
    private minScale = 0.2;
    private maxScale = 3;
    private isPanning = false;
    private lastPos = { x: 0, y: 0 };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot === null) {
            throw new Error('Shadow root not attached');
        }

        this.container = document.createElement('div');
        this.content = document.createElement('div');

        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.position = 'relative';
        this.container.style.userSelect = 'none';
        this.container.style.overflow = 'hidden';

        this.content.style.width = '100%';
        this.content.style.height = '100%';
        this.content.style.position = 'relative';
        this.content.style.display = 'flex';
        this.content.style.justifyContent = 'center';
        this.content.style.alignItems = 'center';
        this.content.style.transformOrigin = '0 0';
        this.content.style.willChange = 'transform';

        this.container.appendChild(this.content);
        this.shadowRoot.appendChild(this.container);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onWheel = this.onWheel.bind(this);
    }

    connectedCallback() {
        // Move children into content
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

    private onMouseDown(e: MouseEvent) {
        let el = e.target as HTMLElement | null;
        // don't pan if already interacting with a node header! 
        // TODO: find a more efficient way to check for this condition
        while (el) {
            if (el.classList && Array.from(el.classList).some(cls => cls.includes('node'))) {
                return;
            }
            el = el.parentElement;
        }

        this.isPanning = true;
        this.lastPos = { x: e.clientX - this.position.x, y: e.clientY - this.position.y };
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
        this.container.style.cursor = 'grabbing';
    }

    private onMouseUp() {
        this.isPanning = false;
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
        this.container.style.cursor = 'default';
    }

    private onWheel(e: WheelEvent) {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale + scaleAmount));

        const rect = this.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const dx = mouseX - this.position.x;
        const dy = mouseY - this.position.y;
        const ratio = newScale / this.scale;

        this.position.x = mouseX - dx * ratio;
        this.position.y = mouseY - dy * ratio;
        this.scale = newScale;
        this.updateTransform();
    }

    private updateTransform() {
        this.content.style.transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.scale})`;
    }
}

customElements.define('transformed-view', TransformedViewElement);
