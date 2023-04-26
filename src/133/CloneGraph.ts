import { GraphNode } from '../../structures/GraphNode';

export function CloneGraph(node: GraphNode | null): GraphNode | null {
    if (!node) {
        return null;
    }

    const visited = new Map<GraphNode, GraphNode>();

    function clone(node: GraphNode): GraphNode {
        if (visited.has(node)) {
            return visited.get(node)!;
        }

        const newNode = new GraphNode(node.val);
        visited.set(node, newNode);

        node.neighbors.forEach(neighbor => {
            newNode.neighbors.push(clone(neighbor));
        });

        return newNode;
    }

    return clone(node);
}
