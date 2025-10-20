/**
 * Graph Layout Utilities
 * Uses BFS algorithm to calculate node positions for the commit graph
 */

/**
 * Get branch color based on branch name
 */
export const getBranchColor = (branchName) => {
  const colors = {
    main: "#667eea",
    master: "#667eea",
    develop: "#4ade80",
    dev: "#4ade80",
    hotfix: "#f87171",
    release: "#a78bfa",
    feature: "#fbbf24",
  };

  // Check for exact match
  if (colors[branchName]) {
    return colors[branchName];
  }

  // Check for prefix match
  const lowerBranch = branchName.toLowerCase();
  if (lowerBranch.startsWith("feature")) return colors.feature;
  if (lowerBranch.startsWith("hotfix")) return colors.hotfix;
  if (lowerBranch.startsWith("release")) return colors.release;
  if (lowerBranch.startsWith("dev")) return colors.develop;

  // Generate a consistent color based on branch name
  const hash = branchName.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 60%)`;
};

/**
 * Calculate levels for each commit based on actual timeline (timestamps)
 * Levels represent horizontal position (left to right: old to new)
 * Ensures commits are positioned chronologically while respecting parent relationships
 */
export const calculateLevels = (commits) => {
  const levels = new Map();

  // Step 1: Sort all commits by timestamp (oldest first)
  const sortedCommits = Array.from(commits.entries()).sort((a, b) => {
    const timeA = a[1].timestampMs || 0;
    const timeB = b[1].timestampMs || 0;
    return timeA - timeB;
  });

  // Step 2: Assign initial levels based on chronological order
  sortedCommits.forEach(([id, commit], index) => {
    levels.set(id, index);
  });

  // Step 3: Adjust levels to ensure child commits are always after ALL parents
  // This is critical for merge commits
  let changed;
  let iterations = 0;
  const maxIterations = commits.size * 2; // Prevent infinite loops

  do {
    changed = false;
    iterations++;

    for (const [id, commit] of commits) {
      if (commit.parents.length > 0) {
        const parentLevels = commit.parents
          .map((pid) => levels.get(pid))
          .filter((level) => level !== undefined);

        if (parentLevels.length > 0) {
          const maxParentLevel = Math.max(...parentLevels);
          const currentLevel = levels.get(id);

          // Commit must be positioned after its latest parent
          if (currentLevel <= maxParentLevel) {
            levels.set(id, maxParentLevel + 1);
            changed = true;

            // Push all subsequent commits forward to maintain chronological spacing
            for (const [otherId, otherCommit] of commits) {
              const otherLevel = levels.get(otherId);
              if (
                otherId !== id &&
                otherLevel > currentLevel &&
                otherLevel <= maxParentLevel + 1
              ) {
                if (otherCommit.timestampMs > commit.timestampMs) {
                  levels.set(otherId, otherLevel + 1);
                }
              }
            }
          }
        }
      }
    }
  } while (changed && iterations < maxIterations);

  // Step 4: Compress levels - remove gaps while maintaining order
  const sortedLevels = Array.from(levels.entries()).sort((a, b) => a[1] - b[1]);

  const compressedLevels = new Map();
  let currentCompressedLevel = 0;
  let lastLevel = -1;

  sortedLevels.forEach(([id, level]) => {
    if (level !== lastLevel) {
      if (lastLevel !== -1) {
        currentCompressedLevel++;
      }
      lastLevel = level;
    }
    compressedLevels.set(id, currentCompressedLevel);
  });

  return compressedLevels;
};

/**
 * Assign lanes (vertical positions) with main/master branch centered
 * Other branches distributed above and below
 */
const assignLanes = (commits, branches, levels) => {
  const lanes = new Map();
  const branchLanes = new Map(); // Track which lane each branch uses

  // Get all unique branch names from commits
  const allBranches = new Set();
  for (const [id, commit] of commits) {
    if (commit.createdByBranch) {
      allBranches.add(commit.createdByBranch);
    }
  }

  const branchNames = Array.from(allBranches);

  // Find main/master branch index
  let mainIndex = branchNames.findIndex((b) => b === "main" || b === "master");
  if (mainIndex === -1 && branchNames.length > 0) {
    mainIndex = 0; // If no main/master, use first branch
  }

  // Assign lanes: main in center, others alternate above/below
  const centerLane = Math.max(0, branchNames.length - 1);

  branchNames.forEach((branchName, index) => {
    if (index === mainIndex) {
      // Main branch gets center lane
      branchLanes.set(branchName, centerLane);
    } else if (index < mainIndex) {
      // Branches before main go above (lower lane numbers)
      branchLanes.set(branchName, centerLane - (mainIndex - index));
    } else {
      // Branches after main go below (higher lane numbers)
      branchLanes.set(branchName, centerLane + (index - mainIndex));
    }
  });

  // Assign lanes to commits based on which branch created them
  for (const [id, commit] of commits) {
    const branchName = commit.createdByBranch || "main";

    // Get the lane for this branch, default to center if not found
    let lane = branchLanes.get(branchName);
    if (lane === undefined) {
      lane = centerLane;
    }

    lanes.set(id, lane);
  }

  return lanes;
};

// Cache for branch colors to ensure consistency
const branchColorCache = new Map();

/**
 * Get cached branch color - ensures color consistency across graph and toolbar
 * @param {string} branchName - The name of the branch
 * @returns {string} - The cached color for the branch
 */
export const getCachedBranchColor = (branchName) => {
  if (!branchColorCache.has(branchName)) {
    branchColorCache.set(branchName, getBranchColor(branchName));
  }
  return branchColorCache.get(branchName);
};

/**
 * Convert Git graph to React Flow nodes and edges
 * Layout: Left to Right (old commits on left, new on right)
 */
export const convertToReactFlow = (gitGraph) => {
  const { commits, branches, HEAD } = gitGraph;

  if (commits.size === 0) {
    return { nodes: [], edges: [] };
  }

  // Calculate levels using BFS (horizontal position)
  const levels = calculateLevels(commits);

  // Assign lanes for vertical positioning
  const lanes = assignLanes(commits, branches, levels);

  // Calculate adaptive spacing based on graph size
  const laneCount = Math.max(...Array.from(lanes.values())) + 1;
  const nodeSpacing = {
    x: 300, // Horizontal spacing
    y: Math.max(120, 800 / Math.max(laneCount, 1)), // Adaptive vertical spacing
  };

  // Create nodes - LEFT TO RIGHT layout
  const nodes = [];

  for (const [id, commit] of commits) {
    const level = levels.get(id) || 0;
    const lane = lanes.get(id) || 0;

    // Find branches pointing to this commit
    const commitBranches = [];
    for (const [branchName, branchCommitId] of branches) {
      if (branchCommitId === id) {
        commitBranches.push(branchName);
      }
    }

    // Use the branch that CREATED this commit for persistent color
    // This ensures commits keep their color even after branch moves
    const creatingBranch = commit.createdByBranch || "main";
    const color = getCachedBranchColor(creatingBranch);

    // Check if this is the HEAD commit
    const isHead = commitBranches.includes(HEAD);

    nodes.push({
      id,
      type: "custom",
      position: {
        x: level * nodeSpacing.x + 150, // Horizontal: left (old) to right (new)
        y: lane * nodeSpacing.y + 100, // Vertical: lanes for different branches
      },
      data: {
        commit,
        branches: commitBranches,
        color,
        isHead,
        headBranch: HEAD, // Pass HEAD to identify active branch
        isMerge: commit.parents.length > 1,
      },
    });
  }

  // Create edges (parent -> child direction, flowing left to right)
  const edges = [];
  for (const [id, commit] of commits) {
    for (let i = 0; i < commit.parents.length; i++) {
      const parentId = commit.parents[i];
      if (commits.has(parentId)) {
        const childNode = nodes.find((n) => n.id === id);
        const parentNode = nodes.find((n) => n.id === parentId);
        const parentCommit = commits.get(parentId);

        // Determine edge type based on node positions
        const isMainLine = i === 0; // First parent is main line

        // For main line, use parent's color (continuity)
        // For merge lines, use child's color (showing what's being merged in)
        const edgeColor = isMainLine
          ? parentNode?.data.color || "#667eea"
          : childNode?.data.color || "#667eea";

        edges.push({
          id: `${parentId}-${id}`,
          source: parentId, // Parent (older, on left)
          target: id, // Child (newer, on right)
          sourceHandle: null,
          targetHandle: null,
          type: "smoothstep", // Use smoothstep for better curves
          animated: false,
          style: {
            stroke: edgeColor,
            strokeWidth: isMainLine ? 3 : 2.5,
            strokeDasharray: !isMainLine ? "8,4" : undefined, // Dashed for merge parents
            opacity: isMainLine ? 1 : 0.7,
          },
          markerEnd: {
            type: "arrowclosed",
            color: edgeColor,
          },
        });
      }
    }
  }

  return { nodes, edges };
};

/**
 * Get list of all branches
 */
export const getAllBranches = (branches) => {
  return Array.from(branches.keys());
};
