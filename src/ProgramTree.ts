import * as nt from './NodeTypes';
import * as nm from './NodeManager';
import * as tn from './TreeNode';
import * as tv from './TransformedView';

const programTreeStyle = /*css*/`
    #connections-canvas {
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        pointer-events:none;
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
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        // for now no attributes require re-rendering
    }

    private getClickspotCenter(nodeId: string, clickspotId: string) {
        const el = document.querySelector(`#${clickspotId}`) as HTMLElement;
        if (!el || !this._transformedViewRef) {
            return null;
        }
        const rect = el.getBoundingClientRect();
        const rectWorld = this._transformedViewRef.screenToWorld({ x: rect.left, y: rect.top });
        return {
            x: rectWorld.x + rect.width / 2,
            y: rectWorld.y + rect.height / 2
        };
    };

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
        
        const nodeElement = this._contentRef?.querySelector(`#${id}`) as HTMLElement;
        const parentElement = nodeElement.parentElement as tn.TreeNodeElement;
        if (parentElement) {
            parentElement.updateTransform(pos);
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
        if (!this._connectionsCanvas || !this._canvasRef) {
            return;
        }

        this.clearLines();

        const connections = this._nodeManager.getAllConnections();
        for (const connection of connections) {
            const fromCenter = this.getClickspotCenter(connection.from.nodeId, connection.from.clickspotId);
            const toCenter = this.getClickspotCenter(connection.to.nodeId, connection.to.clickspotId);
            if (!fromCenter || !toCenter || !connection.from.location || !connection.to.location) {
                console.warn(`Skipping connection from ${connection.from.nodeId} to ${connection.to.nodeId} due to missing clickspot centers or locations.`);
                continue;
            }
            this.drawBezierPath(
                fromCenter,
                toCenter,
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
        this.drawBezierPath(
            start,
            end,
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

        if (this._transformedViewRef) {
            const transformedViewPosition = this._transformedViewRef?.getBoundingClientRect();
            start.x -= transformedViewPosition?.left || 0;
            start.y -= transformedViewPosition?.top || 0;
            end.x -= transformedViewPosition?.left || 0;
            end.y -= transformedViewPosition?.top || 0;
        }


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

    private drawBezierPath(
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
        const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = this.getBezierPath({ start, end }, fromLocation, toLocation);

        this._canvasRef.save();
        this._canvasRef.beginPath();
        if (dashed) {
            this._canvasRef.setLineDash([4, 4]);
        } else {
            this._canvasRef.setLineDash([]);
        }
        this._canvasRef.moveTo(x1, y1);
        this._canvasRef.bezierCurveTo(c1x, c1y, c2x, c2y, x2, y2);
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
                <div id="transform-content" slot="transformed-view-slot" style="position:absolute; top:0; left:0; width:100%; height:100%;">
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
