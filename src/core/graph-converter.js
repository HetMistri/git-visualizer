
export function convertGraphForReactFlow(gitGraph) {
  const nodes = [];
  const edges = [];

  // It's crucial to get all commits from the Map into an array.
  const allCommits = Array.from(gitGraph.commits.values());

  allCommits.forEach((commit, index) => {
    // 1. Create a node for React Flow.
    nodes.push({
      id: commit.id,
      // We'll arrange nodes in a simple column for now. Het can work on a better layout.
      position: { x: 50, y: index * 100 }, 
      data: { label: `${commit.message} (${commit.id.substring(0, 5)})` },
    });

    // 2. Create edges for each parent of the commit.
    commit.parents.forEach(parentId => {
      edges.push({
        id: `e-${parentId}-${commit.id}`,
        source: parentId,
        target: commit.id,
        animated: true, // This makes the edges look nice.
      });
    });
  });

  return { nodes, edges };
}