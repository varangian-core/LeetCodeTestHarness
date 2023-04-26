export class GraphNode {
    constructor(public val: number, public neighbors: GraphNode[] = []) {}

    static createGraphNode(nodes: number[][]): GraphNode[] {
        const graphNodes: GraphNode[] = nodes.map((_, index) => new GraphNode(index + 1));
        nodes.forEach((neighbors, index) => {
            neighbors.forEach(neighbor => {
                graphNodes[index].neighbors.push(graphNodes[neighbor - 1]);
            });
        });
        return graphNodes;
    }

    static graphNodeToString(node: GraphNode | null): string {
        const visited = new Set<GraphNode>();
        const queue: GraphNode[] = node ? [node] : [];

        let result = '[';
        while (queue.length > 0) {
            const currentNode = queue.shift()!;
            if (!visited.has(currentNode)) {
                visited.add(currentNode);
                result += `[${currentNode.val}`;
                currentNode.neighbors.forEach(neighbor => {
                    result += `,${neighbor.val}`;
                    if (!visited.has(neighbor)) {
                        queue.push(neighbor);
                    }
                });
                result += '],';
            }
        }
        result = result.replace(/,$/, '');
        result += ']';

        return result;
    }
}
