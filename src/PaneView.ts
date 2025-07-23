const STORAGE_KEY = 'resizable-pane-widths';

class PaneViewElement extends HTMLElement {
    private columns: HTMLElement[] = [];
    private handles: HTMLElement[] = [];
    private widths: number[] = [];
    private draggingIndex: number | null = null;
    private startX: number = 0;
    private startWidths: number[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadWidths();
        this.applyWidths();
        this.addHandleEvents();
    }

    disconnectedCallback() {
        this.removeHandleEvents();
    }

    getElementById(id: string): HTMLElement | null {
        if (!this.shadowRoot) {
            return null;
        }
        return this.shadowRoot.getElementById(id) as HTMLElement | null;
    }

    querySelector(selector: string): HTMLElement | null {
        if (!this.shadowRoot) {
            return null;
        }
        return this.shadowRoot.querySelector(selector) as HTMLElement | null;
    }

    private render() {
        const style = /*css*/`
            :host {
                display: block;
                width: 100%;
                height: 100%;
                overflow-x: hidden;
            }
            :host *, :host *::before, :host *::after {
                box-sizing: border-box;
            }
            .pane-row {
                display: grid;
                grid-template-rows: 1fr;
                will-change: grid-template-columns;
                height: 100%;
                width: 100%;
            }
            .pane-col {
                position: relative;
            }
            .pane-descriptor {
                padding: 0.5rem;
                background: var(--dark-background-e);
                border-top: 1px solid var(--node-border);
                border-bottom: 1px solid var(--node-border);
                width: 100%;
            }
            .pane-column {
                width: 100%;
            }
            .handle {
                position: absolute;
                top: 0;
                right: -1px;
                width: 1px;
                height: 100%;
                cursor: col-resize;
                z-index: 1;
                background: var(--node-border);
                transition: background-color 100ms ease-in-out;
            }
            .handle:hover {
                background: var(--accent-hovered);
                width: 2px;
            }
            .handle.dragging {
                background: var(--accent-selected);
            }
        `;

        const children = Array.from(this.children);
        this.columns = [];
        this.handles = [];

        const row = document.createElement('div');
        row.className = 'pane-row';

        children.forEach((child, i) => {
            const col = document.createElement('div');
            col.className = 'pane-col';
            col.appendChild(child.cloneNode(true));
            row.appendChild(col);
            this.columns.push(col);

            if (i < children.length - 1) {
                const handle = document.createElement('div');
                handle.className = 'handle';
                handle.dataset.index = i.toString();
                col.appendChild(handle);
                this.handles.push(handle);
            }
        });

        this.shadowRoot!.innerHTML = `<style>${style}</style>`;
        this.shadowRoot!.appendChild(row);
    }

    private addHandleEvents() {
        this.handles.forEach(handle => {
            handle.addEventListener('mousedown', this.onHandleMouseDown);
        });
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }

    private removeHandleEvents() {
        this.handles.forEach(handle => {
            handle.removeEventListener('mousedown', this.onHandleMouseDown);
        });
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onMouseUp);
    }

    private onHandleMouseDown = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        this.draggingIndex = parseInt(target.dataset.index!);
        this.startX = e.clientX;
        this.startWidths = this.getCurrentWidths();
        target.classList.add('dragging');
        e.preventDefault();
    };

    private onMouseMove = (e: MouseEvent) => {
        if (this.draggingIndex === null) {
            return;
        }
        const dx = e.clientX - this.startX;
        const idx = this.draggingIndex;
        let widths = [...this.startWidths];
        const minWidth = 50;

        widths[idx] += dx;
        widths[idx + 1] -= dx;

        // push right
        for (let i = idx + 1; i < widths.length; i++) {
            if (widths[i] < minWidth) {
                const deficit = minWidth - widths[i];
                widths[i] = minWidth;
                if (i + 1 < widths.length) {
                    widths[i + 1] -= deficit;
                }
            }
        }
        // push left
        for (let i = idx; i >= 0; i--) {
            if (widths[i] < minWidth) {
                const deficit = minWidth - widths[i];
                widths[i] = minWidth;
                if (i - 1 >= 0) {
                    widths[i - 1] -= deficit;
                }
            }
        }

        for (let i = widths.length - 1; i >= 0; i--) {
            if (widths[i] < minWidth) {
                widths[i] = minWidth;
            }
        }

        for (let i = 0; i < widths.length; i++) {
            if (widths[i] < minWidth) {
                widths[i] = minWidth;
            }
        }

        const total = widths.reduce((a, b) => a + b, 0);
        this.widths = widths.map(w => w / total);
        this.applyWidths();

        this.startWidths = widths;
        this.startX = e.clientX;
    };

    private onMouseUp = (_e: MouseEvent) => {
        if (this.draggingIndex === null) {
            return;
        }
        this.handles[this.draggingIndex].classList.remove('dragging');
        this.saveWidths();
        this.draggingIndex = null;
    };

    private getCurrentWidths(): number[] {
        return this.columns.map(col => col.getBoundingClientRect().width);
    }

    private applyWidths() {
        if (this.widths.length !== this.columns.length) {
            this.widths = Array(this.columns.length).fill(1 / this.columns.length);
        }
        const row = this.shadowRoot!.querySelector('.pane-row') as HTMLElement;
        row.style.gridTemplateColumns = this.widths.map(w => `${w * 100}%`).join(' ');
    }

    private saveWidths() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.widths));
    }

    private loadWidths() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const arr = JSON.parse(saved);
                if (Array.isArray(arr) && arr.length === this.columns.length) {
                    this.widths = arr;
                }
            } catch { /* ignore */ }
        }
    }
}

customElements.define('pane-view', PaneViewElement);