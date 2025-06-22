import { type Line, type ClickspotLocation } from './TreeNode';
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

    private _nodeManager: NodeManager;

    private _transformedViewRef?: TransformedViewElement;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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

    private renderLines() {
        const connections = this._nodeManager.getAllConnections();
        return connections.map((connection: Connection, idx: number) => {
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
                    stroke="rgb(143, 132, 213)"
                    stroke-width="2"
                    fill="none"
                />
            `;
        }).join('');
    }

    private render() {
        if (!this.shadowRoot) {
            return;
        }
        const nodesHtml = this._nodeManager.getNodes().map(node => `
            <tree-node
                id="${node.id}"
                x="${node.position.x}"
                y="${node.position.y}"
                data-label="${node.label}"
                ${node.clickspots.map(cs => `id="${cs.id}"`).join(' ')}
            >${node.label}</tree-node>
        `).join('');

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./ProgramTree.css">
            <transformed-view id="program-tree-transformed-view">
                <svg class="connections" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;  ">
                    ${this.renderLines()}
                </svg>
                ${nodesHtml}
            </transformed-view>
        `;
        this._transformedViewRef = this.shadowRoot.querySelector('#program-tree-transformed-view') as   TransformedViewElement;
    }
}

customElements.define('program-tree', ProgramTreeElement);
