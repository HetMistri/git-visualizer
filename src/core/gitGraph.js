// A simple utility for generating unique IDs. We'll use this to simulate commit hashes.
const generateId = () => Math.random().toString(36).substring(2, 9);

class CommitNode {
  constructor(message, parents = [], createdByBranch = null) {
    if (!message || message.trim() === "") {
      throw new Error("Commit message cannot be empty");
    }

    this.id = generateId(); // A unique hash for this commit.
    this.message = message.trim(); // The commit message.
    this.parents = parents; // An array of parent commit IDs. A merge commit will have more than one.
    this.createdByBranch = createdByBranch; // Track which branch created this commit

    // Stable timestamp - set once at creation, never changes
    const now = new Date();
    this.timestamp = now.toLocaleString(); // Human-readable timestamp
    this.timestampMs = now.getTime(); // Numeric timestamp for accurate comparisons
  }
}

export class GitGraph {
  constructor() {
    // This is our central data store. A Hash Map is essential here.
    // It maps a commit ID (string) to the full CommitNode object.
    // Why a hash map? Because we need to look up any commit by its ID in O(1) time.
    this.commits = new Map();

    // This hash map stores our branches.
    // It maps a branch name (e.g., "main") to a commit ID.
    // This shows us where the "tip" of each branch is.
    this.branches = new Map();

    // HEAD is the pointer to our current location.
    // It will point to a branch name.
    this.HEAD = null;

    // Track commits that are orphaned (after reset) but not yet garbage collected
    // These will be shown greyed out until the next commit on that branch
    this.orphanedCommits = new Set();

    // Let's create the very first commit when the repository is initialized.
    const initialCommit = new CommitNode("Initial commit", [], "main");
    this.commits.set(initialCommit.id, initialCommit);
    this.branches.set("main", initialCommit.id);
    this.HEAD = "main";
  }

  commit(message) {
    if (!message || message.trim() === "") {
      throw new Error("Commit message cannot be empty");
    }

    if (!this.HEAD || !this.branches.has(this.HEAD)) {
      throw new Error("HEAD is not pointing to a valid branch");
    }

    // GARBAGE COLLECTION: When making a new commit, permanently remove orphaned commits
    // This simulates Git's garbage collection behavior
    if (this.orphanedCommits.size > 0) {
      for (const orphanId of this.orphanedCommits) {
        this.commits.delete(orphanId);
      }
      this.orphanedCommits.clear();
    }

    // 1. Get the ID of the parent commit. This is the commit that the current branch (this.HEAD) points to.
    const parentId = this.branches.get(this.HEAD);

    // 2. Create a new CommitNode with the given message, parent ID, and track the creating branch
    const newCommit = new CommitNode(message, [parentId], this.HEAD);

    // 3. Add the new commit to our `this.commits` hash map.
    this.commits.set(newCommit.id, newCommit);

    // 4. Update the branch pointer in `this.branches` to point to the new commit's ID.
    this.branches.set(this.HEAD, newCommit.id);
  }

  createBranch(branchName) {
    if (!branchName || branchName.trim() === "") {
      throw new Error("Branch name cannot be empty");
    }

    const trimmedName = branchName.trim();

    if (this.branches.has(trimmedName)) {
      throw new Error(`Branch "${trimmedName}" already exists`);
    }

    if (!this.HEAD || !this.branches.has(this.HEAD)) {
      throw new Error("HEAD is not pointing to a valid branch");
    }

    // 1. Get the ID of the commit that the current branch (this.HEAD) points to.
    const currentBID = this.branches.get(this.HEAD);

    // 2. Add a new entry to `this.branches`, mapping the new branchName to that commit ID.
    this.branches.set(trimmedName, currentBID);
  }

  checkout(branchName) {
    // 1. Check if the branch actually exists in our `this.branches` map.
    // 2. If it does not exist throw an error.
    // 3. Else checkout to that branch.

    if (!this.branches.has(branchName)) {
      throw new Error(`Branch "${branchName}" does not exist`);
    }

    this.HEAD = branchName;
  }

  merge(sourceBranchName) {
    if (!sourceBranchName || sourceBranchName.trim() === "") {
      throw new Error("Source branch name cannot be empty");
    }

    // 1. Identify the target branch. This is the branch you are currently on (this.HEAD).
    const targetBranch = this.HEAD;

    if (!targetBranch || !this.branches.has(targetBranch)) {
      throw new Error("HEAD is not pointing to a valid branch");
    }

    // 2. Perform safety checks:
    //    a. Ensure the source branch exists.
    //    b. Ensure the source and target branches are not the same.

    if (!this.branches.has(sourceBranchName)) {
      throw new Error(`Branch "${sourceBranchName}" does not exist`);
    }

    if (sourceBranchName === targetBranch) {
      throw new Error("Cannot merge a branch into itself");
    }

    // 3. Get the commit IDs for both the source and target branch tips.
    const targetId = this.branches.get(targetBranch);
    const sourceId = this.branches.get(sourceBranchName);

    if (targetId === sourceId) {
      throw new Error("Branches are already up-to-date. Nothing to merge");
    }

    // 4. Create a new merge commit. This is the key step:
    //    a. The message should be something like `Merge branch '${sourceBranchName}' into '${this.HEAD}'`.
    //    b. It will have TWO parents: the target branch ID and the source branch ID.

    const mergeCommit = new CommitNode(
      `Merge branch '${sourceBranchName}' into ${this.HEAD}`,
      [targetId, sourceId],
      this.HEAD // Merge commits belong to the branch they're created on
    );

    // 5. Add the new merge commit to the `this.commits` map.
    this.commits.set(mergeCommit.id, mergeCommit);

    // 6. Update the target branch pointer (`this.HEAD`) to point to the new merge commit.
    this.branches.set(targetBranch, mergeCommit.id);
  }

  rebase(sourceBranchName, targetBranchName) {
    // 1. Perform all safety checks (branches exist, not the same branch, etc.)
    if (
      sourceBranchName === targetBranchName ||
      !this.branches.has(sourceBranchName) ||
      !this.branches.has(targetBranchName)
    ) {
      console.error("Invalid rebase operation.");
      return;
    }

    // 2. Get the commit IDs for both branch tips.
    const sourceTipId = this.branches.get(sourceBranchName);
    const targetTipId = this.branches.get(targetBranchName);

    // 3. Find all the commits on the source branch that are "new"
    //    (i.e., not already part of the target branch's history).
    const commitsToReplay = [];
    const oldCommitIds = []; // Track old commits to mark as orphaned
    let currentCommitId = sourceTipId;
    const targetHistory = new Set(); // Use a Set for fast O(1) lookups

    // Build the target branch's history
    let tempId = targetTipId;
    while (tempId) {
      targetHistory.add(tempId);
      const commit = this.commits.get(tempId);
      tempId = commit.parents[0]; // Simplified: assumes single parent history for target
    }

    // Walk up the source branch until we find a commit that's in the target history (the common ancestor)
    while (currentCommitId && !targetHistory.has(currentCommitId)) {
      const commit = this.commits.get(currentCommitId);
      commitsToReplay.push(commit);
      oldCommitIds.push(currentCommitId); // Track this old commit
      currentCommitId = commit.parents[0]; // Assumes single parent history for source
    }

    // The commits were added from newest to oldest. We must reverse them.
    commitsToReplay.reverse();

    // 4. "Replay" the commits on top of the target branch.
    //    Each new commit is a COPY with a new ID, but belongs to the source branch.
    let currentParentId = targetTipId; // Start replaying on top of the target's tip

    commitsToReplay.forEach((commit) => {
      // Create a NEW commit object with the same message
      // IMPORTANT: The new commit belongs to sourceBranchName (createdByBranch)
      const newCommit = new CommitNode(
        commit.message,
        [currentParentId],
        sourceBranchName // Preserve the branch ownership!
      );

      // Add it to our central store
      this.commits.set(newCommit.id, newCommit);

      // The next replayed commit will have this new commit as its parent
      currentParentId = newCommit.id;
    });

    // 5. Update the source branch pointer to point to the last new commit.
    this.branches.set(sourceBranchName, currentParentId);

    // 6. Mark the old commits as orphaned (they've been rewritten)
    //    They'll be shown greyed out and removed on next commit to source branch
    oldCommitIds.forEach((oldId) => {
      this.orphanedCommits.add(oldId);
    });

    // 7. Checkout the source branch.
    this.HEAD = sourceBranchName;
  }

  revert(commitIdToRevert) {
    // 1. Safety Check: Ensure the commit we're trying to revert actually exists.
    if (!this.commits.has(commitIdToRevert)) {
      console.error(`Error: Commit "${commitIdToRevert}" does not exist.`);
      return;
    }

    // 2. Get the commit object we are reverting to read its message.
    const commitToRevert = this.commits.get(commitIdToRevert);

    // 3. Get the current parent ID (the tip of the current branch).
    const parentId = this.branches.get(this.HEAD);

    // 4. Create the new revert commit message.
    const revertMessage = `Revert "${commitToRevert.message}"`;

    // 5. Create the new commit, just like a normal commit.
    const newCommit = new CommitNode(revertMessage, [parentId]);

    // 6. Add the new revert commit to the central store.
    this.commits.set(newCommit.id, newCommit);

    // 7. Update the current branch to point to this new revert commit.
    this.branches.set(this.HEAD, newCommit.id);
  }

  // Helper: Get all commits reachable from a given commit (walking backwards through parents)
  getReachableCommits(startCommitId) {
    const reachable = new Set();
    const queue = [startCommitId];

    while (queue.length > 0) {
      const commitId = queue.shift();
      if (reachable.has(commitId)) continue;

      reachable.add(commitId);
      const commit = this.commits.get(commitId);
      if (commit && commit.parents.length > 0) {
        queue.push(...commit.parents);
      }
    }

    return reachable;
  }

  // Helper: Get all commits reachable from any branch
  getAllReachableCommits() {
    const allReachable = new Set();
    for (const branchTip of this.branches.values()) {
      const reachable = this.getReachableCommits(branchTip);
      reachable.forEach((id) => allReachable.add(id));
    }
    return allReachable;
  }

  reset(commitId) {
    // Git reset: Move the current branch's pointer to the specified commit
    // This effectively "rewinds" the branch history

    if (!commitId || typeof commitId !== "string") {
      throw new Error("Commit ID is required for reset");
    }

    if (!this.commits.has(commitId)) {
      throw new Error(`Commit "${commitId}" does not exist`);
    }

    if (!this.HEAD || !this.branches.has(this.HEAD)) {
      throw new Error("HEAD is not pointing to a valid branch");
    }

    // Get the current branch tip (before reset)
    const oldBranchTip = this.branches.get(this.HEAD);

    console.log("\n=== RESET DEBUG ===");
    console.log("Resetting branch:", this.HEAD);
    console.log("From commit:", oldBranchTip);
    console.log("To commit:", commitId);
    console.log("\nAll branches BEFORE reset:");
    for (const [branch, tip] of this.branches.entries()) {
      console.log(`  ${branch} -> ${tip}`);
    }

    // Find all commits that were reachable from the old tip
    const oldReachable = this.getReachableCommits(oldBranchTip);
    console.log("\nCommits reachable from old tip:", Array.from(oldReachable));

    // Move the current branch pointer to the specified commit
    this.branches.set(this.HEAD, commitId);

    console.log("\nAll branches AFTER moving pointer:");
    for (const [branch, tip] of this.branches.entries()) {
      console.log(`  ${branch} -> ${tip}`);
    }

    // Find all commits that are NOW reachable after the reset
    const newReachable = this.getAllReachableCommits();
    console.log(
      "\nCommits reachable from ALL branches:",
      Array.from(newReachable)
    );

    // Commits that were reachable before but not anymore are orphaned
    // (They existed in the old branch but are no longer reachable from any branch)
    console.log("\nMarking orphaned commits:");
    for (const id of oldReachable) {
      if (!newReachable.has(id)) {
        console.log(`  ${id} - ORPHANED`);
        this.orphanedCommits.add(id);
      } else {
        console.log(`  ${id} - still reachable`);
      }
    }

    console.log("\nOrphaned commits:", Array.from(this.orphanedCommits));
    console.log("=== END RESET DEBUG ===\n");

    // Note: Orphaned commits will be shown greyed out
    // They'll be permanently deleted on the next commit to this branch
  }
}
