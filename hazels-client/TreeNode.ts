export type Point = { x: number; y: number };
export type Line = { start: Point; end: Point };
export type ClickspotLocation = 'left' | 'right' | 'bottom';
export type Clickspot = { id: string; location: ClickspotLocation };
export type ClickspotInfo = { nodeId: string; clickspotId: string; location: ClickspotLocation | null };

export class TreeNodeElement extends HTMLElement {
    // Observed attributes for attributeChangedCallback
    static get observedAttributes() {
        return ['id', 'x', 'y'];
    }

    // Callbacks set externally!
    onMove?: (pos: Point) => void;
    onConnectStart?: (from: ClickspotInfo) => void;
    onConnectEnd?: (from: ClickspotInfo, to: ClickspotInfo) => void;
    onDisconnect?: (info: ClickspotInfo) => void;
    onTempLine?: (info: [Line, ClickspotLocation] | null) => void;
    isClickspotConnected?: (info: ClickspotInfo) => boolean;

    setCallbacks(callbacks: {
        onMove?: (pos: Point) => void;
        onConnectStart?: (from: ClickspotInfo) => void;
        onConnectEnd?: (from: ClickspotInfo, to: ClickspotInfo) => void;
        onDisconnect?: (info: ClickspotInfo) => void;
        onTempLine?: (info: [Line, ClickspotLocation] | null) => void;
        isClickspotConnected?: (info: ClickspotInfo) => boolean;
    }) {
        Object.assign(this, callbacks);
    }

    private isDragging = false;
    private dragOffset: Point = { x: 0, y: 0 };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
        if (name === 'node-id' && newValue) {
            this._nodeId = newValue;
        }
        if (name === 'x' && newValue) {
            this._position.x = Number(newValue);
        }
        if (name === 'y' && newValue) { 
            this._position.y = Number(newValue);
        }
        this.render();
    }

    private _nodeId: string = '';
    private _position: Point = { x: 0, y: 0 };
    private _clickspots: Clickspot[] = [];
    private _isDragging: boolean = false;
    private _dragOffset: Point = { x: 0, y: 0 };
    set data(val: { nodeId: string; position: Point; clickspots: Clickspot[] }) {
        this._nodeId = val.nodeId;
        this._position = val.position;
        this._clickspots = val.clickspots;
        // drag parameters not needed because they are handled entirely internally
        this._isDragging = false;
        this._dragOffset = { x: 0, y: 0 };
        this.render();
    }

    private attachEventListeners() {
        // Delegated event listeners for drag, clickspots, etc.
        if (this.shadowRoot) {
            this.shadowRoot.querySelector('.node-header')?.addEventListener('mousedown', this.startNodeDrag.bind(this));
            this.shadowRoot.querySelectorAll('.node-clickspot')?.forEach(c => c.addEventListener('mousedown', this.onConnectStart.bind(this)));
        }
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
        this._isDragging = true;
        const mouseWorld = this.screenToWorld({ x: event.clientX, y: event.clientY });
        // mouse as delta from drag start last paint
        this._dragOffset = {
            x: mouseWorld.x - this._dragOffset.x,
            y: mouseWorld.y - this._dragOffset.y,
        };

        function onMouseMove(e: MouseEvent) {
            if (!this._isDragging) {
                return;
            }
            const dragWorld = this.screenToWorld({ x: e.clientX, y: e.clientY });
            this.onMove({
                x: dragWorld.x - this._dragOffset.current.x,
                y: dragWorld.y - this._dragOffset.current.y,
            });
        }

        function onMouseUp() {
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
        if (this.isClickspotConnected(clickspotId)) {
            this.onDisconnect(clickspotId);
        } else {
            const nodeClickspot = (event.target as HTMLElement).closest('.node-clickspot');
            if (!nodeClickspot) {
                this.onTempLine(null);
                return;
            }

            this._isDragging = true;

            const nodeRect = nodeClickspot.getBoundingClientRect();
            const nodeCenterScreen = {
                x: nodeRect.left + nodeRect.width / 2,
                y: nodeRect.top + nodeRect.height / 2,
            };
            const nodeCenter = this.screenToWorld(nodeCenterScreen);

            // need to recreate the info because we previously didn't know the parent information
            const parentNode = (event.target as HTMLElement).closest('.node');
            if (!parentNode) {
                this.onTempLine(null);
                return;
            }
            const parentNodeId = parentNode.getAttribute('id');
            if (!parentNodeId) {
                this.onTempLine(null);
                return;
            }
            const parentClickspotContainer = nodeClickspot.closest('.node-clickspot-container');
            if (!parentClickspotContainer) {
                this.onTempLine(null);
                return;
            }
            const parentLocation = this.getLocationByClassList(parentClickspotContainer.classList);
            this.onConnectStart({ nodeId: parentNodeId, clickspotId: clickspotId, location: parentLocation });

            function onMouseMove(e: MouseEvent) {
                if (!this._isDragging) {
                    this.onTempLine(null);
                    return;
                }
                const mouseScreen = { x: e.clientX, y: e.clientY };
                const mouseWorld = this.screenToWorld(mouseScreen);
                this.onTempLine([{
                    start: { x: nodeCenter.x, y: nodeCenter.y },
                    end: { x: mouseWorld.x, y: mouseWorld.y },
                }, parentLocation!]); // non-null strengthened (at call site)
            }

            function onMouseUp(e: MouseEvent) {
                this._isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                const mouseScreen = { x: e.clientX, y: e.clientY };
                const hoveredElement = document.elementFromPoint(mouseScreen.x, mouseScreen.y);

                if (!hoveredElement || !hoveredElement.classList.contains('node-clickspot') || hoveredElement.classList.contains('connected')) {
                    this.onTempLine(null);
                    return;
                }

                const targetClickspotId = hoveredElement.getAttribute('id');
                const nodeElement = hoveredElement.closest('.node') as HTMLElement | null;
                if (!nodeElement || !targetClickspotId) {
                    this.onTempLine(null);
                    return;
                }

                const targetNodeId = nodeElement.getAttribute('id');

                const targetClickspotContainer = hoveredElement.closest('.node-clickspot-container');
                if (!targetClickspotContainer) {
                    this.onTempLine(null);
                    return;
                }
                const targetLocation = this.getLocationByClassList(targetClickspotContainer.classList);

                if (targetNodeId && targetNodeId !== parentNodeId) {
                    this.onConnectEnd(
                        { nodeId: parentNodeId!, clickspotId: clickspotId, location: parentLocation },
                        { nodeId: targetNodeId, clickspotId: targetClickspotId, location: targetLocation }
                    );
                }

                this.onTempLine(null);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    }

    private render() {
        if (!this.shadowRoot) {
            return;
        }
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./TreeNode.css">
            <div
                class="node shadowed"
                id="${this._nodeId}"
                style="left: ${this._position.x}px; top: ${this._position.y}px;"
            >
                <div class="node-header">
                    <img src="./assets/expression.svg" class="node-icon" alt="Node Icon" />
                    <span>Exponentiation Expression</span>
                </div>
                <div class="node-body">
                    ${(['left', 'bottom', 'right'] as const).map(location => `
                        <div class="node-clickspot-container ${location}">
                            ${this._clickspots.filter(cs => cs.location === location).map(cs => `
                                <button
                                    class="node-clickspot"
                                    id="${cs.id}"
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
    }
}

customElements.define('tree-node', TreeNodeElement);
