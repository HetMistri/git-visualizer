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

    // We can add more properties later, like author or timestamp, but this is the essential core.
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

  reset() {
    // Clear all commits and branches, then reinitialize
    this.commits.clear();
    this.branches.clear();

    const initialCommit = new CommitNode("Initial commit", [], "main");
    this.commits.set(initialCommit.id, initialCommit);
    this.branches.set("main", initialCommit.id);
    this.HEAD = "main";
  }
}
