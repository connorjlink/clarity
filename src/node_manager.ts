import * as nt from './node_types';

export class NodeManager {
    private nodes: Map<string, nt.NodeData> = new Map();
    // adjacency map: nodeId -> Set of connected nodeIds
    private connections: Map<string, Set<nt.Connection>> = new Map();

    private static connectionKey(a: nt.ClickspotInfo, b: nt.ClickspotInfo) {
        return [a.nodeId, a.clickspotId, b.nodeId, b.clickspotId].sort().join('|');
    }

    constructor(initialNodes: nt.NodeData[] = [], initialConnections: nt.Connection[] = []) {
        initialNodes.forEach(node => this.nodes.set(node.id, node));
        initialConnections.forEach(conn => this.connect(conn.from, conn.to));
    }

    getNodes(): nt.NodeData[] {
        return Array.from(this.nodes.values());
    }

    getAllConnections(): nt.Connection[] {
        return Array.from(this.connections.values()).flatMap(set => Array.from(set));
    }

    getConnections(nodeId: string): Set<nt.Connection> {
        const result = new Set<nt.Connection>();
        for (const set of this.connections.values()) {
            for (const conn of set) {
                if (conn.from.nodeId === nodeId || conn.to.nodeId === nodeId) {
                    result.add(conn);
                }
            }
        }
        return result;
    }

    addNode(node: nt.NodeData) {
        this.nodes.set(node.id, node);
    }

    removeNode(nodeId: string) {
        this.nodes.delete(nodeId);
        for (const [nodeId, connections] of Array.from(this.connections.entries())) {
            for (const connection of connections) {
                if (connection.from.nodeId === nodeId || connection.to.nodeId === nodeId) {
                    connections.delete(connection);
                }
                if (connections.size === 0) {
                    this.connections.delete(nodeId);
                }
            }
        }
    }

    updateNodePosition(nodeId: string, position: nt.Point) {
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

    connect(from: nt.ClickspotInfo, to: nt.ClickspotInfo) {
        if (from.nodeId === to.nodeId) {
            return;
        }
        // using outbound adjacency lists
        let set = this.connections.get(from.nodeId);
        if (!set) {
            set = new Set<nt.Connection>();
            this.connections.set(from.nodeId, set);
        }
        set.add({ from, to });

        document.getElementById(from.clickspotId)?.classList.toggle('connected', true);
        var fromNode = this.nodes.get(from.nodeId)?.clickspots.find(cs => cs.id === from.clickspotId);
        if (fromNode) {
            fromNode.isConnected = true;
        }

        document.getElementById(to.clickspotId)?.classList.toggle('connected', true);
        var toNode = this.nodes.get(to.nodeId)?.clickspots.find(cs => cs.id === to.clickspotId);
        if (toNode) {
            toNode.isConnected = true;
        }
    }

    disconnect(info: nt.ClickspotInfo) {
        for (const [nodeId, connections] of this.connections.entries()) {
            for (const connection of connections) {
                if (
                    (connection.from.nodeId === info.nodeId && connection.from.clickspotId === info.clickspotId) ||
                    (connection.to.nodeId === info.nodeId && connection.to.clickspotId === info.clickspotId)
                ) {
                    
                    document.getElementById(connection.from.clickspotId)?.classList.toggle('connected', false);
                    var fromNode = this.nodes.get(connection.from.nodeId)?.clickspots.find(cs => cs.id === connection.from.clickspotId);
                    if (fromNode) {
                        fromNode.isConnected = false;
                    }
                    
                    document.getElementById(connection.to.clickspotId)?.classList.toggle('connected', false);
                    var toNode = this.nodes.get(connection.to.nodeId)?.clickspots.find(cs => cs.id === connection.to.clickspotId);
                    if (toNode) {
                        toNode.isConnected = false;
                    }

                    connections.delete(connection);
                    if (connections.size === 0) {
                        this.connections.delete(nodeId);
                    }
                    break;
                }
            }
            
        }
    }

    load(nodes: nt.NodeData[], connections: nt.Connection[]) {
        this.nodes.clear();
        this.connections.clear();
        nodes.forEach(node => this.nodes.set(node.id, node));
        connections.forEach(conn => this.connect(conn.from, conn.to));
    }
}

export default NodeManager;
