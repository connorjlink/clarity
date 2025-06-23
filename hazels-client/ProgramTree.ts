import { TreeNodeElement, type Point, type Line, type ClickspotLocation, type ClickspotInfo } from './TreeNode';
import { NodeManager, type Connection } from './NodeManager';
import { TransformedViewElement as TransformedViewElement } from './TransformedView';

function getBezierPath(
    line: Line,
    fromLocation: ClickspotLocation,
    toLocation: ClickspotLocation | null  // inferred if not provided
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

    return `M ${start.x},${start.y} C ${c1x},${c1y} ${c2x},${c2y} ${end.x},${end.y}`;
}

export class ProgramTreeElement extends HTMLElement {
    static observedAttributes = [];

    // model references
    private _nodeManager: NodeManager;

    // DOM references
    private _transformedViewRef?: TransformedViewElement;
    private _connectionsRef?: SVGSVGElement;

    constructor() {
        super();
        this._nodeManager = new NodeManager([
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

    private isClickspotConnected(info: ClickspotInfo) {
        const connections = this._nodeManager.getConnections(info.nodeId);
        for (const connection of connections) {
            if (connection.from.clickspotId === info.clickspotId || connection.to.clickspotId === info.clickspotId) {
                return true;
            }
        }
        return false;
    };

    private handleConnectStart(from: ClickspotInfo) {
        // stub
    };

    private handleConnectEnd(from: ClickspotInfo, to: ClickspotInfo) {
        if (from && (from.nodeId !== to.nodeId || from.clickspotId !== to.clickspotId)) {
            this._nodeManager.connect(from, to);
            this.handleTempLine(null);
        }
        this.renderLines();
    };

    private handleRemoveLines(tofrom: ClickspotInfo) {
        this._nodeManager.disconnect(tofrom);
        
        // complex selector, but cheaper than reloading every path from scratch

        const fromLinesRef = this._connectionsRef?.querySelectorAll(`path[data-connection-from="${tofrom.nodeId}-${tofrom.clickspotId}"]`);
        fromLinesRef?.forEach(el => el.remove());

        const toLinesRef = this._connectionsRef?.querySelectorAll(`path[data-connection-to="${tofrom.nodeId}-${tofrom.clickspotId}"]`);
        toLinesRef?.forEach(el => el.remove());
    };

    private handleNodeMove(id: string, pos: Point) {
        this._nodeManager.updateNodePosition(id, pos);
        // since moving a node can repath multiple lines, it makes sense to re-render everything for now
        this.renderLines();
        this.renderNodes(); // TODO; figure out a way to move the existing nodes instead of a complete DOM re-render!!!!!!!!
    };

    private handleTempLine(line: [Line, ClickspotLocation] | null) {
        // always remove the old one, back out if we don't want to draw a new one
        this._connectionsRef?.querySelectorAll('.temp-line').forEach(el => el.remove());
        if (!line) {
            return;
        }

        const { start, end } = line[0];
        const fromLocation = line[1];
        const path = getBezierPath(line[0], fromLocation, null);

        const tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempLine.setAttribute('d', path);
        tempLine.setAttribute('stroke', 'rgb(171, 167, 200)');
        tempLine.setAttribute('stroke-width', '2');
        tempLine.setAttribute('stroke-dasharray', '4');
        tempLine.setAttribute('fill', 'none');
        tempLine.classList.add('temp-line');

        this._connectionsRef?.appendChild(tempLine);
    }

    private renderLines() {
        const connections = this._nodeManager.getAllConnections();
        const markup =  connections.map((connection: Connection, idx: number) => {
            const fromCenter = this.getClickspotCenter(connection.from.nodeId, connection.from.clickspotId);
            const toCenter = this.getClickspotCenter(connection.to.nodeId, connection.to.clickspotId);
            if (!fromCenter || !toCenter || !connection.from.location || !connection.to.location) {
                return '';
            }
            return `
                <path
                    d="${getBezierPath(
                        { start: { x: fromCenter.x, y: fromCenter.y }, end: { x: toCenter.x, y: toCenter.y } },
                        connection.from.location,
                        connection.to.location
                    )}"
                    data-connection-from="${connection.from.nodeId}-${connection.from.clickspotId}"
                    data-connection-to="${connection.to.nodeId}-${connection.to.clickspotId}"
                    stroke="rgb(143, 132, 213)"
                    stroke-width="2"
                    fill="none"
                />
            `;
        }).join('');

        this._connectionsRef!.innerHTML = markup;
    }

    private renderNodes() {
        const contentRef = this._transformedViewRef?.querySelector('div[slot="transformed-view-slot"]');
        if (!contentRef) {
            console.error('Transformed view content slot not found');
            return;
        }

        const existingNodes = contentRef.querySelectorAll('tree-node');
        existingNodes.forEach(node => node.remove());

        for (const node of this._nodeManager.getNodes()) {
            // custom elements
            const nodeElement = document.createElement('tree-node') as TreeNodeElement;
            nodeElement.setAttribute('id', node.id);
            nodeElement.setAttribute('x', node.position.x.toString());
            nodeElement.setAttribute('y', node.position.y.toString());
            
            const nodeContent = nodeElement.querySelector('.node-content');
            if (nodeContent) {
                nodeContent.textContent = node.label;
            }

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

            contentRef.appendChild(nodeElement);
        }
    }

    private render() {
        this.innerHTML = `
            <transformed-view id="program-tree-transformed-view">
                <div slot="transformed-view-slot">
                    <svg id="connections">
                    </svg>
                </div>
            </transformed-view>
        `;

        this._transformedViewRef = this.querySelector('#program-tree-transformed-view') as TransformedViewElement;
        this._connectionsRef = this._transformedViewRef.querySelector('#connections') as SVGSVGElement;

        this.renderNodes();
        this.renderLines();
    }
}

customElements.define('program-tree', ProgramTreeElement);
