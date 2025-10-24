import { useState, useCallback, useMemo } from "react";
import { GitGraph } from "../core/gitGraph";
import { convertToReactFlow, getAllBranches } from "../utils/graphLayout";

/**
 * Custom hook to manage Git graph state and operations
 */
export const useGitGraph = () => {
  const [gitGraph] = useState(() => new GitGraph());
  const [updateCounter, setUpdateCounter] = useState(0);

  // Force re-render by incrementing counter
  const forceUpdate = useCallback(() => {
    setUpdateCounter((prev) => prev + 1);
  }, []);

  // Commit operation
  const commit = useCallback(
    (message) => {
      try {
        gitGraph.commit(message);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Create branch operation
  const createBranch = useCallback(
    (branchName) => {
      try {
        gitGraph.createBranch(branchName);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Checkout operation
  const checkout = useCallback(
    (branchName) => {
      try {
        gitGraph.checkout(branchName);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Merge operation
  const merge = useCallback(
    (sourceBranch) => {
      try {
        gitGraph.merge(sourceBranch);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Reset operation - moves current branch pointer to specified commit
  const reset = useCallback(
    (commitId) => {
      try {
        gitGraph.reset(commitId);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Revert operation
  const revert = useCallback(
    (commitId) => {
      try {
        if (!commitId) {
          throw new Error("No commit selected");
        }
        gitGraph.revert(commitId);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Rebase operation
  const rebase = useCallback(
    (sourceBranch, targetBranch) => {
      try {
        if (!sourceBranch || !targetBranch) {
          throw new Error("Both source and target branches are required");
        }
        gitGraph.rebase(sourceBranch, targetBranch);
        forceUpdate();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [gitGraph, forceUpdate]
  );

  // Convert graph to React Flow format (memoized)
  const { nodes, edges } = useMemo(() => {
    return convertToReactFlow(gitGraph);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCounter]);

  // Get all branches
  const branches = useMemo(() => {
    return getAllBranches(gitGraph.branches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCounter]);

  // Get current HEAD
  const currentBranch = gitGraph.HEAD;

  // Get commit by ID
  const getCommit = useCallback(
    (commitId) => {
      return gitGraph.commits.get(commitId);
    },
    [gitGraph]
  );

  // Get branches for a commit
  const getBranchesForCommit = useCallback(
    (commitId) => {
      const result = [];
      for (const [branchName, branchCommitId] of gitGraph.branches) {
        if (branchCommitId === commitId) {
          result.push(branchName);
        }
      }
      return result;
    },
    [gitGraph]
  );

  // Get stats
  const stats = useMemo(() => {
    return {
      commits: gitGraph.commits.size,
      branches: gitGraph.branches.size,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCounter]);

  return {
    // Operations
    commit,
    createBranch,
    checkout,
    merge,
    reset,
    revert,
    rebase,

    // Data
    nodes,
    edges,
    branches,
    currentBranch,
    stats,

    // Helpers
    getCommit,
    getBranchesForCommit,
    gitGraph, // Expose gitGraph instance for advanced operations
  };
};
