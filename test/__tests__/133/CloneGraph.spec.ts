import { GraphNode } from '../../../structures/GraphNode';
import { CloneGraph } from "../../../src/133/CloneGraph";

const { createGraphNode, graphNodeToString } = GraphNode;

test('CloneGraph Test Case 1', () => {
  const input = createGraphNode([[2, 4], [1, 3], [2, 4], [1, 3]]);
  const output = CloneGraph(input[0]);
  expect(graphNodeToString(output)).toBe(graphNodeToString(input[0]));
});

test('CloneGraph Test Case 2', () => {
  const input = createGraphNode([[]]);
  const output = CloneGraph(input[0]);
  expect(graphNodeToString(output)).toBe(graphNodeToString(input[0]));
});

test('CloneGraph Test Case 3', () => {
  const input = createGraphNode([]);
  const output = CloneGraph(null);
  expect(graphNodeToString(output)).toBe(graphNodeToString(null));
});
