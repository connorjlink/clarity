import * as nt from './NodeTypes';

const treeNodeStyle = /*css*/`
    tre-node {
        position: absolute;
    }

    .node {
        margin: 1rem;
        height: 100px;
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        -webkit-user-select: none;
        user-select: none;
        background: none;
        border-radius: var(--corner-radius);
        will-change: transform;
    }

    .node-header {
        font-size: 8pt;
        width: 100%;
        border-radius: var(--corner-radius) var(--corner-radius) 0 0;
        border: 1px solid var(--node-border);
        background: var(--keyword);
        display: flex;
        flex-direction: row;
        align-items: center;
    }
        .node-header .node-icon {
            height: 15px;
            padding: 0 1px;
        }

    .node-body {
        border-radius: 0 0 var(--corner-radius) var(--corner-radius);
        border: 1px solid var(--node-border);
        border-top: none;
        background: var(--dark-background-e);
        flex: 1;
        width: 100%;
    }

    .node-clickspot-container {
        position: absolute;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
        .node-clickspot-container.left {
            left: 0;
            top: 0;
            transform: translateX(-50%);
        }
        .node-clickspot-container.right {
            right: 0;
            top: 0;
            transform: translateX(50%);
        }
        .node-clickspot-container.bottom {
            height: initial;
            width: 100%;
            flex-direction: row;
            bottom: 0;
            left: 0;
            transform: translateY(50%);
        }

    .node-clickspot {
        aspect-ratio: 1 / 1;
        width: var(--clickspot-width);
        background: var(--light-background-d);
        border: dashed 1px var(--light-background-ll);
        border-radius: 50%;
    }
        .node-clickspot.connected {
            background: var(--accent);
            border-color: var(--accent-hovered);
        }
        .node-clickspot:hover {
            background: var(--light-background);
        }
        .node-clickspot.connected:hover {
            background: var(--accent-hovered);
        }
`;
const treeNodeStyleSheet = new CSSStyleSheet();
treeNodeStyleSheet.replaceSync(treeNodeStyle);


export class TreeNodeElement extends HTMLElement {
    // Observed attributes for attributeChangedCallback
    static get observedAttributes() {
        return ['id', 'x', 'y'];
    }

    // NOTE: Parent must set callbacks set externally!
    onMove?: (pos: nt.Point) => void;
    onConnectStart?: (from: nt.ClickspotInfo) => void;
    onConnectEnd?: (from: nt.ClickspotInfo, to: nt.ClickspotInfo) => void;
    onDisconnect?: (info: nt.ClickspotInfo) => void;
    onTempLine?: (info: [nt.Line, nt.ClickspotLocation] | null) => void;
    isClickspotConnected?: (info: nt.ClickspotInfo) => boolean;
    screenToWorld?: (screenPoint: nt.Point) => nt.Point;
    worldToScreen?: (worldPoint: nt.Point) => nt.Point;

    private _areCallbacksSet = false;

    setCallbacks(callbacks: {
        onMove?: (pos: nt.Point) => void;
        onConnectStart?: (from: nt.ClickspotInfo) => void;
        onConnectEnd?: (from: nt.ClickspotInfo, to: nt.ClickspotInfo) => void;
        onDisconnect?: (info: nt.ClickspotInfo) => void;
        onTempLine?: (info: [nt.Line, nt.ClickspotLocation] | null) => void;
        isClickspotConnected?: (info: nt.ClickspotInfo) => boolean;
        screenToWorld?: (screenPoint: nt.Point) => nt.Point;
        worldToScreen?: (worldPoint: nt.Point) => nt.Point;
    }) {
        Object.assign(this, callbacks);
        this._areCallbacksSet = true;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [treeNodeStyleSheet];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'node-id' && newValue) {
            this._nodeId = newValue;
        }
        this.render();
    }

    private _contentRef?: HTMLElement | null;

    private _nodeId: string = '';
    private _position: nt.Point = { x: 0, y: 0 };
    private _clickspots: nt.Clickspot[] = [];
    private _isDragging: boolean = false;
    private _dragOffset: nt.Point = { x: 0, y: 0 };
    set data(val: { nodeId: string; position: nt.Point; clickspots: nt.Clickspot[] }) {
        this._nodeId = val.nodeId;
        this._position = val.position;
        this._clickspots = val.clickspots;
        // drag parameters not needed because they are handled entirely internally
        this._isDragging = false;
        this._dragOffset = { x: 0, y: 0 };
        this.render();
    }

    elementFromPoint(x: number, y: number): HTMLElement | null {
        const element = this.shadowRoot!.elementFromPoint(x, y);
        if (element) {
            return element as HTMLElement;
        }
        return null;
    }

    clickspotFromId(clickspotId: string): HTMLElement | null {
        return this.shadowRoot!.querySelector(`#${clickspotId}`) as HTMLElement | null;
    }

    getBoundingClientRect(): DOMRect {
        const element = this.shadowRoot!.querySelector(`#${this._nodeId}`);
        if (element) {
            return element.getBoundingClientRect();
        }
        return new DOMRect(0, 0, 0, 0);
    }
    
    getRealNode(): TreeNodeElement | null {
        return this.shadowRoot!.querySelector(`#${this._nodeId}`) as TreeNodeElement | null;
    }

    updateTransform(pos: nt.Point) {
        this._position = pos;
        if (this._contentRef) {
            this._contentRef.style.transform = `translate3d(${this._position.x}px, ${this._position.y}px, 0)`;
        }
    }

    setConnected(clickspotId: string, connected: boolean) {
        const clickspot = this.clickspotFromId(clickspotId);
        if (clickspot) {
            clickspot.classList.toggle('connected', connected);
        }
    }

    private attachEventListeners() {
        this.shadowRoot!.querySelector('.node-header')?.addEventListener('mousedown', (event: Event) => {
            this.startNodeDrag(event as MouseEvent);
        });
        this.shadowRoot!.querySelectorAll('.node-clickspot')?.forEach(c => {
            c.addEventListener('mousedown', (event: Event) => {
                this.handleClickspotMouseDown(c.getAttribute('id')!, event as MouseEvent);
            });
        });
    }

    private getLocationByClassList(classList: DOMTokenList) {
        if (classList.contains('left')) {
            return 'left';
        } else if (classList.contains('right')) {
            return 'right';
        } else if (classList.contains('bottom')) {
            return 'bottom';
        } else {
            return null;
        }
    }

    private startNodeDrag(event: MouseEvent) {
        // only accept primary button, usually left mouse
        if (event.button !== 0) {
            return;
        }
        this._isDragging = true;
        const mouseWorld = this.screenToWorld!({ x: event.clientX, y: event.clientY });
        this._dragOffset = {
            x: mouseWorld.x - this._position.x,
            y: mouseWorld.y - this._position.y,
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!this._isDragging) {
                return;
            }
            const dragWorld = this.screenToWorld!({ x: e.clientX, y: e.clientY });
            this.onMove?.({
                x: dragWorld.x - this._dragOffset.x,
                y: dragWorld.y - this._dragOffset.y,
            });
        }

        const onMouseUp = () => {
            this._isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    private handleClickspotMouseDown(clickspotId: string, event: MouseEvent) {
        // only accept primary button, usually left mouse
        if (event.button !== 0) {
            return;
        }
        if (this.isClickspotConnected!({ nodeId: this._nodeId, clickspotId: clickspotId, location: null })) {
            this.onDisconnect!({ nodeId: this._nodeId, clickspotId: clickspotId, location: null });
        } else {
            const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot');
            if (!nodeClickspot) {
                this.onTempLine!(null);
                return;
            }

            this._isDragging = true;

            const nodeRect = nodeClickspot.getBoundingClientRect();
            const nodeCenterScreen = {
                x: nodeRect.left + nodeRect.width / 2,
                y: nodeRect.top + nodeRect.height / 2,
            };
            const nodeCenter = this.screenToWorld!(nodeCenterScreen);

            // need to recreate the info because we previously didn't know the parent information
            const parentNode = (event.target as HTMLElement).closest('.node');
            if (!parentNode) {
                this.onTempLine!(null);
                return;
            }
            const parentNodeId = parentNode.getAttribute('id');
            if (!parentNodeId) {
                this.onTempLine!(null);
                return;
            }
            const parentClickspotContainer = nodeClickspot.closest('.node-clickspot-container');
            if (!parentClickspotContainer) {
                this.onTempLine!(null);
                return;
            }
            const parentLocation = this.getLocationByClassList(parentClickspotContainer.classList);
            this.onConnectStart!({ nodeId: parentNodeId, clickspotId: clickspotId, location: parentLocation });

            const onMouseMove = (e: MouseEvent) => {
                if (!this._isDragging) {
                    this.onTempLine!(null);
                    return;
                }
                const mouseScreen = { x: e.clientX, y: e.clientY };
                const mouseWorld = this.screenToWorld!(mouseScreen);
                this.onTempLine!([{
                    start: { x: nodeCenter.x, y: nodeCenter.y },
                    end: { x: mouseWorld.x, y: mouseWorld.y },
                }, parentLocation!]); // non-null strengthened (at call site)
            }

            const onMouseUp = (e: MouseEvent) => {
                this._isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // searches the #transform-content host element for the other nodes
                const mouseScreen = { x: e.clientX, y: e.clientY };

                const allNodes = Array.from(this.parentElement!.querySelectorAll('tree-node')) as TreeNodeElement[];
                let hoveredNode: TreeNodeElement | null = null;
                let hoveredClickspot: HTMLElement | null = null;

                for (const node of allNodes) {
                    const rect = node.getBoundingClientRect();
                    if (
                        mouseScreen.x >= rect.left &&
                        mouseScreen.x <= rect.right &&
                        mouseScreen.y >= rect.top &&
                        mouseScreen.y <= rect.bottom
                    ) {
                        const el = node.elementFromPoint(mouseScreen.x, mouseScreen.y);
                        if (el && el.classList.contains('node-clickspot') && !el.classList.contains('connected')) {
                            hoveredNode = node.getRealNode();
                            hoveredClickspot = el;
                            break;
                        }
                    }
                }

                if (!hoveredNode) {
                    this.onTempLine!(null);
                    return;
                }
                if (!hoveredClickspot || !hoveredClickspot.classList.contains('node-clickspot') || hoveredClickspot.classList.contains('connected')) {
                    this.onTempLine!(null);
                    return;
                }

                const targetClickspotId = hoveredClickspot.getAttribute('id');
                const targetNodeId = hoveredNode.getAttribute('id');
                if (!targetClickspotId || !targetNodeId) {
                    this.onTempLine!(null);
                    return;
                }

                const targetClickspotContainer = hoveredClickspot.closest('.node-clickspot-container');
                if (!targetClickspotContainer) {
                    this.onTempLine!(null);
                    return;
                }
                const targetLocation = this.getLocationByClassList(targetClickspotContainer.classList);
                
                if (targetNodeId && targetNodeId !== parentNodeId) {
                    this.onConnectEnd!(
                        { nodeId: parentNodeId!, clickspotId: clickspotId, location: parentLocation },
                        { nodeId: targetNodeId, clickspotId: targetClickspotId, location: targetLocation }
                    );
                }

                this.onTempLine!(null);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <div
                id="${this._nodeId}"
                class="node shadowed"
            >
                <div class="node-header">
                    <img src="/clarity/res/expression.svg" class="node-icon" />
                    <span>Exponentiation Expression</span>
                </div>
                <div class="node-body">
                    ${(['left', 'bottom', 'right'] as const).map(location => `
                        <div class="node-clickspot-container ${location}">
                            ${this._clickspots.filter(cs => cs.location === location).map(cs => `
                                <button
                                    class="node-clickspot"
                                    id="${cs.id}"
                                    class="${cs.isConnected ? 'connected' : ''}"
                                ></button>
                            `).join('')}
                        </div>
                    `).join('')}
                    <div class="node-content">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;

        this._contentRef = this.shadowRoot!.querySelector(`#${this._nodeId}`);
        this.updateTransform(this._position);

        if (this._areCallbacksSet) {
            this.attachEventListeners();
        }
    }
}

customElements.define('tree-node', TreeNodeElement);
