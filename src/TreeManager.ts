import { type Clickspot } from './TreeNode';
import { type Point } from './TransformedView';

export type TreeNodeData = {
    id: string;
    label: string;
    position: { x: number; y: number };
    parentId?: string;
    clickspots: Clickspot[];
};

export type ClickspotLocation = 'left' | 'right' | 'bottom';

export type ClickspotInfo = {
    nodeId: string;
    clickspotId: string;
    location: ClickspotLocation | null;
};

export type Connection = {
    from: ClickspotInfo;
    to: ClickspotInfo;
};

export class TreeManager {
    private nodes: Map<string, TreeNodeData> = new Map();
    // adjacency map: nodeId -> Set of connected nodeIds
    private connections: Map<string, Connection> = new Map();

    private static connectionKey(a: ClickspotInfo, b: ClickspotInfo) {
        return [a.nodeId, a.clickspotId, b.nodeId, b.clickspotId].sort().join('|');
    }

    constructor(initialNodes: TreeNodeData[] = [], initialConnections: Connection[] = []) {
        initialNodes.forEach(node => this.nodes.set(node.id, node));
        initialConnections.forEach(conn => this.connect(conn.from, conn.to));
    }

    getNodes(): TreeNodeData[] {
        return Array.from(this.nodes.values());
    }

    getAllConnections(): Connection[] {
        return Array.from(this.connections.values());
    }

    getConnections(nodeId: string): Set<Connection> {
        return new Set(
            Array.from(this.connections.values()).filter(
                c => c.from.nodeId === nodeId || c.to.nodeId === nodeId
            )
        );
    }

    addNode(node: TreeNodeData) {
        this.nodes.set(node.id, node);
    }

    removeNode(nodeId: string) {
        this.nodes.delete(nodeId);
        for (const [key, conn] of Array.from(this.connections.entries())) {
            if (conn.from.nodeId === nodeId || conn.to.nodeId === nodeId) {
                this.connections.delete(key);
            }
        }
    }

    updateNodePosition(nodeId: string, position: Point) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.position = position;
        }
    }

    setParent(childId: string, parentId?: string) {
        const node = this.nodes.get(childId);
        if (node) {
            node.parentId = parentId;
        }
    }

    connect(from: ClickspotInfo, to: ClickspotInfo) {
        if (from.nodeId === to.nodeId) return;
        const key = TreeManager.connectionKey(from, to);
        this.connections.set(key, { from, to });
    }

    disconnect(info: ClickspotInfo) {
        for (const [key, conn] of this.connections.entries()) {
            if (
                (conn.from.nodeId === info.nodeId && conn.from.clickspotId === info.clickspotId) ||
                (conn.to.nodeId === info.nodeId && conn.to.clickspotId === info.clickspotId)
            ) {
                this.connections.delete(key);
            }
        }
    }

    load(nodes: TreeNodeData[], connections: Connection[]) {
        this.nodes.clear();
        this.connections.clear();
        nodes.forEach(node => this.nodes.set(node.id, node));
        connections.forEach(conn => this.connect(conn.from, conn.to));
    }
}
