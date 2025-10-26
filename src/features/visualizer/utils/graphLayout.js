/**
 * Graph Layout Utilities
 * Uses BFS algorithm to calculate node positions for the commit graph
 */

/**
 * Convert HSL to HEX for consistent usage in UI (e.g., box-shadows expect HEX with alpha)
 */
const hslToHex = (h, s, l) => {
  // h: 0-360, s: 0-100, l: 0-100
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) =>
    Math.round(255 * x)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

/**
 * Stable string hash -> 32-bit unsigned int
 */
const hashString = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0; // ensure unsigned
};

/**
 * Deterministic, high-contrast branch color based on name.
 * - Known branch names map to curated, recognizable colors (HEX)
 * - Others use golden-angle HSL spread converted to HEX for distinctness
 */
export const getBranchColor = (branchName) => {
  const name = (branchName || "").trim();
  const lower = name.toLowerCase();

  // Curated colors for common branches (distinct and recognizable)
  const fixed = {
    main: "#3B82F6", // blue
    master: "#3B82F6", // same as main
    develop: "#22C55E", // green
    dev: "#22C55E",
    hotfix: "#EF4444", // red
    release: "#8B5CF6", // violet
    feature: "#F59E0B", // amber
  };

  if (fixed[lower]) return fixed[lower];
  if (lower.startsWith("feature")) return fixed.feature;
  if (lower.startsWith("hotfix")) return fixed.hotfix;
  if (lower.startsWith("release")) return fixed.release;
  if (lower.startsWith("dev")) return fixed.develop;

  // Golden-angle distribution over hue space for clear separation
  // Using fractional part of (hash * phi) for uniform coverage
  const phi = 0.618033988749895; // golden ratio conjugate
  const h = Math.floor(360 * ((hashString(name) * phi) % 1));
  const s = 72; // vivid but not neon
  const l = 52; // good contrast on dark/light glass
  return hslToHex(h, s, l);
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
  sortedCommits.forEach(([id], index) => {
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
const assignLanes = (commits) => {
  const lanes = new Map();
  const branchLanes = new Map(); // Track which lane each branch uses

  // Get all unique branch names from commits
  const allBranches = new Set();
  for (const [, commit] of commits) {
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
  const key = (branchName || "").trim();
  if (!branchColorCache.has(key)) {
    branchColorCache.set(key, getBranchColor(key));
  }
  return branchColorCache.get(key);
};

/**
 * Convert Git graph to React Flow nodes and edges
 * Layout: Left to Right (old commits on left, new on right)
 */
export const convertToReactFlow = (gitGraph) => {
  const { commits, branches, HEAD, orphanedCommits } = gitGraph;

  if (commits.size === 0) {
    return { nodes: [], edges: [] };
  }

  // Calculate levels using BFS (horizontal position)
  const levels = calculateLevels(commits);

  // Assign lanes for vertical positioning
  const lanes = assignLanes(commits);

  // Calculate adaptive spacing based on graph size
  const laneCount = Math.max(...Array.from(lanes.values())) + 1;
  const nodeSpacing = {
    x: 200, // Horizontal spacing
    y: Math.max(200, 800 / Math.max(laneCount, 1)), // Adaptive vertical spacing
  };

  // Create nodes - LEFT TO RIGHT layout
  const nodes = [];

  for (const [id, commit] of commits) {
    const level = levels.get(id) || 0;
    const lane = lanes.get(id) || 0;

    // Find branches pointing to this commit
    const commitBranches = [];
    const branchColors = {}; // Map branch names to their colors
    for (const [branchName, branchCommitId] of branches) {
      if (branchCommitId === id) {
        commitBranches.push(branchName);
        branchColors[branchName] = getCachedBranchColor(branchName);
      }
    }

    // Use the branch that CREATED this commit for persistent color
    // This ensures commits keep their color even after branch moves
    const creatingBranch = commit.createdByBranch || "main";
    const color = getCachedBranchColor(creatingBranch);

    // Check if this is the HEAD commit
    const isHead = commitBranches.includes(HEAD);

    // Check if this commit is orphaned (after reset, pending garbage collection)
    const isOrphaned = orphanedCommits && orphanedCommits.has(id);

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
        branchColors, // Add branch-specific colors
        color,
        isHead,
        headBranch: HEAD, // Pass HEAD to identify active branch
        isMerge: commit.parents.length > 1,
        isOrphaned, // Mark orphaned commits
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

        // Determine edge type based on node positions
        const isMainLine = i === 0; // First parent is main line

        // Check if either end of the edge is orphaned
        const isOrphanedEdge =
          childNode?.data.isOrphaned ||
          false ||
          parentNode?.data.isOrphaned ||
          false;

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
          type: "custom", // Use custom edge type for circle markers
          animated: false,
          style: {
            stroke: isOrphanedEdge ? "#9ca3af" : edgeColor, // Lighter grey for orphaned edges
            strokeWidth: isOrphanedEdge ? 2 : isMainLine ? 3 : 2.5,
            strokeDasharray: isOrphanedEdge
              ? "8,8" // More prominent dashes for orphaned
              : !isMainLine
              ? "8,4"
              : undefined,
            opacity: isOrphanedEdge ? 0.4 : isMainLine ? 1 : 0.7, // Slightly more visible
            strokeLinecap: "round", // Round line caps for smoother appearance
          },
          // Remove markerEnd to eliminate arrowheads - you can add circles via CSS or custom component
          markerEnd: undefined,
          data: {
            isOrphaned: isOrphanedEdge, // Mark orphaned edges
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
