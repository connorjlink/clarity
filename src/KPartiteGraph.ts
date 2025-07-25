type NodeID = string;
type LayerID = string;

/* 
    Example Usage:
        
    const g = new KPartiteGraph();

    g.addEdge('A', 'a1', 'B', 'b1');
    g.addEdge('A', 'a1', 'B', 'b2');
    g.addEdge('B', 'b1', 'C', 'c1');
    g.addEdge('B', 'b2', 'C', 'c2');

    console.log(g.getNeighbors('A', 'a1')); // => Set { 'b1', 'b2' }
    console.log(g.recursiveNeighbors('A', ['a1'], 2)); // => Set { 'a1', 'b1', 'b2', 'c1', 'c2' }
*/

class KPartiteGraph {
    // splits the graph into forward and backward relationships for quick bidirectional traversal
    private forward: Map<LayerID, Map<NodeID, Set<NodeID>>> = new Map();
    private backward: Map<LayerID, Map<NodeID, Set<NodeID>>> = new Map();
    private partitions: LayerID[] = []; 

    addEdge(sourceLayer: LayerID, sourceNode: NodeID, destinationLayer: LayerID, destinationNode: NodeID): void {
        // forward edge 
        {
            if (!this.forward.has(sourceLayer)) {
                this.forward.set(sourceLayer, new Map());
            }

            // non-null strengthened
            if (!this.forward.get(sourceLayer)!.has(sourceNode)) {
                this.forward.get(sourceLayer)!.set(sourceNode, new Set());
            }

            // non-null strengthened
            this.forward.get(sourceLayer)!.get(sourceNode)!.add(destinationNode);   
        }
       
        // backward edge
        {
            if (!this.backward.has(destinationLayer)) {
                this.backward.set(destinationLayer, new Map());
            }

            // non-null strengthened
            if (!this.backward.get(destinationLayer)!.has(destinationNode)) {
                this.backward.get(destinationLayer)!.set(destinationNode, new Set());
            }

            this.backward.get(destinationLayer)!.get(destinationNode)!.add(sourceNode);  
        }
        
        if (!this.partitions.includes(sourceLayer)) {
            this.partitions.push(sourceLayer);
        }

        if (!this.partitions.includes(destinationLayer)) {
            this.partitions.push(destinationLayer);
        }
    }   

    getNeighbors(layer: LayerID, node: NodeID): Set<NodeID> {
        const forwardNeighbors = this.getForwardNeighbors(layer, node);
        const backwardNeighbors = this.getBackwardNeighbors(layer, node);
        
        return new Set([...forwardNeighbors, ...backwardNeighbors]);
    }   

    getForwardNeighbors(layer: LayerID, node: NodeID): Set<NodeID> {
        return this.forward.get(layer)?.get(node) ?? new Set();
    }

    getBackwardNeighbors(layer: LayerID, node: NodeID): Set<NodeID> {
        return this.backward.get(layer)?.get(node) ?? new Set();
    }

    // NOTE: only recurses forward!
    getRecursiveNeighbors(startLayer: LayerID, startNodes: NodeID[], depth: number): Set<NodeID> {
        let currentNodes = new Set(startNodes);
        const visited = new Set<NodeID>(startNodes);
        let currentLayer = startLayer;    

        for (let d = 0; d < depth; d++) {
            const index = this.partitions.indexOf(currentLayer);

            if (index === -1 || index + 1 >= this.partitions.length) {
                break; 
            }

            const nextLayer = this.partitions[index + 1];
            const nextNodes = new Set<NodeID>();    

            for (const node of currentNodes) {
                const neighbors = this.forward.get(currentLayer)?.get(node);

                if (neighbors) {
                    for (const neighbor of neighbors) {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            nextNodes.add(neighbor);
                        }
                    }
                }
            }   
            currentNodes = nextNodes;
            currentLayer = nextLayer;
        } 

        return visited;
    }
}
