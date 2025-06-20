export type TreeNodeData = {
    id: string;
    label: string;
    position: { x: number; y: number };
    parentId?: string; // when undefined, this node is the root
};

export class TreeManager {
    private nodes: TreeNodeData[] = [];

    constructor(initialNodes: TreeNodeData[] = []) {
        this.nodes = initialNodes;
    }

    getNodes(): TreeNodeData[] {
        return this.nodes;
    }

    addNode(node: TreeNodeData) {
        this.nodes.push(node);
    }

    removeNode(nodeId: string) {
        this.nodes = this.nodes.filter(n => n.id !== nodeId && n.parentId !== nodeId);
    }

    updateNodePosition(nodeId: string, position: { x: number; y: number }) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.position = position;
        }
    }

    setParent(childId: string, parentId?: string) {
        const node = this.nodes.find(n => n.id === childId);
        if (node) {
            node.parentId = parentId;
        }
    }

    // TODO: load from some common serialization format!!!
    load(nodes: TreeNodeData[]) {
        this.nodes = nodes;
    }
}