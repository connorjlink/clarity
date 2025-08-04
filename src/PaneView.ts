const paneViewStyle = /*css*/`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }
    
    :host *, :host *::before, :host *::after {
        box-sizing: border-box;
    }

    pane-view {
        overflow-x: hidden;
    }

    .pane-row {
        display: grid;
        grid-template-rows: 1fr;
        will-change: grid-template-columns;
        height: 100%;
        width: 100%;
    }

    .pane-column {
        width: 100%;
        position: relative;
        background: var(--dark-background-d);
        z-index: 1;
        overflow: hidden;
    }
        .pane-column.hidden {
            display: none;
        }
    
    .handle {
        width: 1px;
        cursor: col-resize;
        background: var(--node-border);
        z-index: 3;
        height: 100%;
        transition: background-color 100ms ease-in-out;
    }
        .handle:hover {
            background: var(--accent-hovered);
            width: 2px;
        }
        .handle.dragging {
            background: var(--accent-selected);
        }

    .pane-descriptor {
        padding: 0.5rem;
        background: var(--dark-background-e);
        border-top: 1px solid var(--node-border);
        border-bottom: 1px solid var(--node-border);
        width: 100%;
        position: relative;
        z-index: 2;
    }
`;
const paneViewStyleSheet = new CSSStyleSheet();
paneViewStyleSheet.replaceSync(paneViewStyle);

const STORAGE_KEY = 'resizable-pane-widths';

class PaneViewElement extends HTMLElement {
    private columns: HTMLElement[] = [];
    private handles: HTMLElement[] = [];
    private widths: number[] = [];
    private draggingIndex: number | null = null;
    private startX: number = 0;
    private startWidths: number[] = [];
    private visible: boolean[] = [];
    private originalPanes: HTMLElement[] = []; 

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.originalPanes.length === 0) {
            this.originalPanes = Array.from(this.querySelectorAll('.pane-column')) as HTMLElement[];
        }
        this.loadWidths();
        this.render();
        this.applyWidths();
        this.addHandleEvents();
    }

    disconnectedCallback() {
        this.removeHandleEvents();
    }

    setVisiblePanes(visible: boolean[]) {
        this.visible = visible;
        this.render();
        this.applyWidths();
        this.addHandleEvents();
    }

    private render() {
        this.innerHTML = `<style>${paneViewStyle}</style>`;
    
        const row = document.createElement('div');
        row.className = 'pane-row';
    
        this.columns = [];
        this.handles = [];
    
        this.originalPanes.forEach((pane, i) => {
            Array.from(pane.querySelectorAll('.handle')).forEach(h => h.remove());
        
            if (this.visible[i]) {
                row.appendChild(pane);
                this.columns.push(pane);
                if (this.columns.length - 1 < this.visible.filter(Boolean).length - 1) {
                    const handle = document.createElement('div');
                    handle.className = 'handle';
                    handle.dataset.index = (this.columns.length - 1).toString();
                    row.appendChild(handle);
                    this.handles.push(handle);
                }
            }
        });
    
        this.appendChild(row);
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
        const row = this.querySelector('.pane-row') as HTMLElement;
        if (!row) return;

        let template = '';
        for (let i = 0; i < this.columns.length; i++) {
            template += `${this.widths[i] * 100}% `;
            if (i < this.columns.length - 1) {
                template += '1px ';
            }
        }
        row.style.gridTemplateColumns = template.trim();

        let gridIndex = 1;
        this.columns.forEach(col => {
            if (!col.classList.contains('hidden')) {
                col.style.gridColumn = `${gridIndex}`;
                gridIndex += 2;
            }
        });
        this.handles.forEach((handle, i) => {
            handle.style.gridColumn = `${2 * (i + 1)}`;
        });
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