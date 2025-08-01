import * as nt from './NodeTypes';
import * as nm from './NodeManager';
import * as tn from './TreeNode';
import * as tv from './TransformedView';

const programTreeStyle = /*css*/`
    transformed-view {
        display: block;
        width: 100%;
        height: 100%;
    }
    #connections-canvas {
        position:absolute;
        top:0;
        left:0;
        width: var(--transform-size);
        height: var(--transform-size);
        pointer-events:none;
    }
    #transform-content {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--transform-size);
        height: var(--transform-size);
        transform: translate(50%, 50%);
    }
`;
const programTreeStyleSheet = new CSSStyleSheet();
programTreeStyleSheet.replaceSync(programTreeStyle);


export class ProgramTreeElement extends HTMLElement {
    static observedAttributes = [];

    // model references
    private _nodeManager: nm.NodeManager;

    // DOM references
    private _transformedViewRef?: tv.TransformedViewElement;
    private _contentRef?: HTMLElement;
    private _connectionsCanvas?: HTMLCanvasElement;
    private _canvasRef?: CanvasRenderingContext2D;

    constructor() {
        super();
        this._nodeManager = new nm.NodeManager([
            {
                id: 'node1',
                label: 'Hello, 123123',
                position: { x: 100, y: 100 },
                clickspots: [
                    { id: 'clickspot-a', location: 'left' },
                    { id: 'clickspot-b', location: 'right' },
                    { id: 'clickspot-e', location: 'bottom' },
                ]
            },
            {
                id: 'node2',
                label: 'This is a new test node',
                position: { x: 400, y: 200 },
                clickspots: [
                    { id: 'clickspot-c', location: 'left' },
                    { id: 'clickspot-d', location: 'bottom' }
                ]
            },
            {
                id: 'node3',
                label: 'Testing testing testing',
                position: { x: 550, y: 400 },
                clickspots: [
                    { id: 'clickspot-f', location: 'left' },
                    { id: 'clickspot-g', location: 'left' }
                ]
            }
        ]);
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.adoptedStyleSheets = [programTreeStyleSheet];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // for now no attributes require re-rendering
    }

    setNodeConnected(nodeId: string, clickspotId: string, connected: boolean) {
        const nodeElement = this.shadowRoot!.querySelector(`tree-node[data-node-id="${nodeId}"]`) as tn.TreeNodeElement | null;
        if (nodeElement) {
            nodeElement.setConnected(clickspotId, connected);
        }
    }

    private getClickspotCenterScreen(nodeId: string, clickspotId: string) {
        const node = this.shadowRoot!.querySelector(`tree-node[data-node-id="${nodeId}"]`) as tn.TreeNodeElement | null;
        if (!node || !this._connectionsCanvas) {
            return null;
        }
        const el = node.clickspotFromId(clickspotId);
        if (!el) {
            return null;
        }
        const spotRect = el.getBoundingClientRect();
        const canvasRect = this._connectionsCanvas.getBoundingClientRect();
        return {
            x: spotRect.left + spotRect.width / 2 - canvasRect.left,
            y: spotRect.top + spotRect.height / 2 - canvasRect.top
        };
    }

    private isClickspotConnected(info: nt.ClickspotInfo) {
        const connections = this._nodeManager.getConnections(info.nodeId);
        for (const connection of connections) {
            if (connection.from.clickspotId === info.clickspotId || connection.to.clickspotId === info.clickspotId) {
                return true;
            }
        }
        return false;
    };

    private handleConnectStart(from: nt.ClickspotInfo) {
        // stub
    };

    private handleConnectEnd(from: nt.ClickspotInfo, to: nt.ClickspotInfo) {
        if (from && (from.nodeId !== to.nodeId || from.clickspotId !== to.clickspotId)) {
            this._nodeManager.connect(from, to);
            this.handleTempLine(null);
        }
        this.renderLines();
    };

    private handleRemoveLines(tofrom: nt.ClickspotInfo) {
        this._nodeManager.disconnect(tofrom);
        
        if (!this._connectionsCanvas || !this._canvasRef) {
            return;
        }

        this.renderLines();
    };

    private handleNodeMove(id: string, pos: nt.Point) {
        this._nodeManager.updateNodePosition(id, pos);
        
        const node = this.shadowRoot!.querySelector(`tree-node[data-node-id="${id}"]`) as tn.TreeNodeElement | null;
        if (node) {
            node.updateTransform(pos);
        }
        
        // since moving a node can repath multiple lines, it makes sense to re-render everything for now
        this.renderLines();
    };

    private clearLines() {
        if (!this._connectionsCanvas || !this._canvasRef) {
            return;
        }

        this._canvasRef.clearRect(0, 0, this._connectionsCanvas.width, this._connectionsCanvas.height);
    }

    private renderLines() {
        if (!this._connectionsCanvas || !this._canvasRef || !this._transformedViewRef) {
            return;
        }
    
        this.clearLines();
    
        const connections = this._nodeManager.getAllConnections();
        for (const connection of connections) {
            const fromScreen = this.getClickspotCenterScreen(connection.from.nodeId, connection.from.clickspotId);
            const toScreen = this.getClickspotCenterScreen(connection.to.nodeId, connection.to.clickspotId);
            if (!fromScreen || !toScreen || !connection.from.location) {
                continue;
            }
            this.drawBezierPathScreen(
                fromScreen,
                toScreen,
                connection.from.location,
                connection.to.location,
                'rgb(143, 132, 213)',
                2,
                false
            );
        }
    }

    private handleTempLine(line: [nt.Line, nt.ClickspotLocation] | null) {
        this.renderLines();
        if (!line || !this._canvasRef) {
            return;
        }

        const { start, end } = line[0];
        const fromLocation = line[1];

        const offset = this.getBoundingClientRect() || { left: 0, top: 0 };
        const transform = this._transformedViewRef?.getTransform();
        if (transform) {
            start.x *= transform.scale;
            start.y *= transform.scale;
            end.x *= transform.scale;
            end.y *= transform.scale;
        }

        const startScreen = {
            x: start.x - offset.left,
            y: start.y - offset.top
        };
        const endScreen = {
            x: end.x - offset.left,
            y: end.y - offset.top
        };

        this.drawBezierPathScreen(
            startScreen,
            endScreen,
            fromLocation,
            null,
            'rgb(171, 167, 200)',
            2,
            true
        );
    }

    private getBezierPath(
        line: nt.Line,
        fromLocation: nt.ClickspotLocation,
        toLocation: nt.ClickspotLocation | null  // inferred if not provided
    ) {
        const { start, end } = line;
        // set the curve ratio: a higher value enforces greater curvature 
        // and closer adherence to the location - based stretching
        const controlOffset = 100;

        let inferredToLocation = toLocation;
        if (!toLocation && fromLocation) {
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            if (fromLocation === 'left') {
                if (angle > -45 && angle < 45) {
                    inferredToLocation = 'left';
                } else if (angle >= 45 && angle <= 135) {
                    inferredToLocation = 'bottom';
                } else {
                    inferredToLocation = null;
                }
            } else if (fromLocation === 'right') {
                if (angle > 135 || angle < -135) {
                    inferredToLocation = 'right';
                } else if (angle >= -135 && angle <= -45) {
                    inferredToLocation = 'bottom';
                } else {
                    inferredToLocation = null;
                }
            } else if (fromLocation === 'bottom') {
                if (angle > 135 || angle < -135) {
                    inferredToLocation = 'right';
                } else if (angle > -45 && angle < 45) {
                    inferredToLocation = 'left';
                } else if (angle >= 45 && angle <= 135) {
                    inferredToLocation = 'bottom';
                }
            }
        }

        let c1x = start.x;
        let c1y = start.y;
        if (fromLocation === 'left') {
            c1x -= controlOffset;
        } else if (fromLocation === 'right') {
            c1x += controlOffset;
        } else if (fromLocation === 'bottom') {
            c1y += controlOffset;
        }

        let c2x = end.x;
        let c2y = end.y;
        if (inferredToLocation === 'left') {
            c2x -= controlOffset;
        } else if (inferredToLocation === 'right') {
            c2x += controlOffset;
        } else if (inferredToLocation === 'bottom') {
            c2y += controlOffset;
        }

        return  [start.x, start.y, c1x, c1y, c2x, c2y, end.x, end.y];
    }

    private drawBezierPathScreen(
        start: nt.Point,
        end: nt.Point,
        fromLocation: nt.ClickspotLocation,
        toLocation: nt.ClickspotLocation | null,
        strokeStyle: string,
        lineWidth: number,
        dashed: boolean
    ) {
        if (!this._canvasRef) {
            return;
        }

        const transform = this._transformedViewRef?.getTransform();
        if (transform) {
            start.x /= transform.scale;
            start.y /= transform.scale;
            end.x /= transform.scale;
            end.y /= transform.scale;
        }
    
        const controlOffset = 100;
        let c1x = start.x;
        let c1y = start.y;
        if (fromLocation === 'left') {
            c1x -= controlOffset;
        } else if (fromLocation === 'right') {
            c1x += controlOffset;
        } else if (fromLocation === 'bottom') {
            c1y += controlOffset;
        }
    
        let c2x = end.x;
        let c2y = end.y;
        if (toLocation === 'left') {
            c2x -= controlOffset;
        } else if (toLocation === 'right') {
            c2x += controlOffset;
        } else if (toLocation === 'bottom') {
            c2y += controlOffset;
        }
    
        this._canvasRef.save();
        if (dashed) {
            this._canvasRef.setLineDash([4, 4]);
        } else {
            this._canvasRef.setLineDash([]);
        }
        this._canvasRef.beginPath();
        this._canvasRef.moveTo(start.x, start.y);
        this._canvasRef.bezierCurveTo(c1x, c1y, c2x, c2y, end.x, end.y);
        this._canvasRef.strokeStyle = strokeStyle;
        this._canvasRef.lineWidth = lineWidth;
        this._canvasRef.stroke();
        this._canvasRef.restore();
    }

    private resizeCanvas() {
        if (!this._connectionsCanvas) {
            return;
        }
        const parent = this._connectionsCanvas.parentElement;
        if (parent) {
            const rect = parent.getBoundingClientRect();
            this._connectionsCanvas.width = rect.width;
            this._connectionsCanvas.height = rect.height;
        }
    }

    private renderNodes() {
        if (!this._contentRef) {
            return;
        }

        const nodesById = new Map<string, tn.TreeNodeElement>();
        this._contentRef.querySelectorAll('tree-node').forEach(node => {
            const id = node.getAttribute('id');
            if (id) {
                nodesById.set(id, node as tn.TreeNodeElement);
            }
        });

        const currentNodeIds = new Set<string>();
        for (const node of this._nodeManager.getNodes()) {
            currentNodeIds.add(node.id);
            let nodeElement = nodesById.get(node.id);

            if (!nodeElement) {
                nodeElement = document.createElement('tree-node') as tn.TreeNodeElement;

                nodeElement.data = {
                    nodeId: node.id,
                    position: node.position,
                    clickspots: node.clickspots
                };

                nodeElement.setCallbacks({
                    onMove: (pos) => this.handleNodeMove(node.id, pos),
                    onConnectStart: (info) => this.handleConnectStart(info),
                    onConnectEnd: (from, to) => this.handleConnectEnd(from, to),
                    onDisconnect: (info) => this.handleRemoveLines(info),
                    onTempLine: (info) => this.handleTempLine(info),
                    isClickspotConnected: (info) => this.isClickspotConnected(info),
                    screenToWorld: (pt) => this._transformedViewRef?.screenToWorld(pt) ?? pt,
                    worldToScreen: (pt) => this._transformedViewRef?.worldToScreen(pt) ?? pt
                });

                nodeElement.setAttribute('data-node-id', node.id);

                this._contentRef.appendChild(nodeElement);
            }

            const nodeContent = nodeElement.querySelector('.node-content');
            if (nodeContent) {
                nodeContent.textContent = node.label;
            }
        }

        nodesById.forEach((nodeElement, id) => {
            if (!currentNodeIds.has(id)) {
                nodeElement.remove();
            }
        });
    }

    private render() {
        this.shadowRoot!.innerHTML = `
            <transformed-view id="program-tree-transformed-view">
                <div id="transform-content" slot="transformed-view-slot">
                    <canvas id="connections-canvas"></canvas>
                </div>
            </transformed-view>
        `;

        this._transformedViewRef = this.shadowRoot!.querySelector('#program-tree-transformed-view') as tv.TransformedViewElement;
        this._contentRef = this._transformedViewRef.querySelector('#transform-content') as HTMLDivElement;

        this._connectionsCanvas = this._contentRef.querySelector('#connections-canvas') as HTMLCanvasElement;
        this._canvasRef = this._connectionsCanvas.getContext('2d')!;

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.renderLines();
        });

        this.resizeCanvas();
        this.renderLines();
        this.renderNodes();
    }
}

customElements.define('program-tree', ProgramTreeElement);
