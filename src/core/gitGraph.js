// A simple utility for generating unique IDs. We'll use this to simulate commit hashes.
const generateId =( ) => Math.random().toString(36).substring(2, 9);

class CommitNode {
  constructor(message, parents = []) {
    this.id = generateId(); // A unique hash for this commit.
    this.message = message; // The commit message.
    this.parents = parents; // An array of parent commit IDs. A merge commit will have more than one.
    
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
    const initialCommit = new CommitNode("Initial commit");
    this.commits.set(initialCommit.id, initialCommit);
    this.branches.set("main", initialCommit.id);
    this.HEAD = "main";

  }


  commit(message) {

    // 1. Get the ID of the parent commit. This is the commit that the current branch (this.HEAD) points to.

    const parentId = this.branches.get(this.HEAD);

    // 2. Create a new CommitNode with the given message and the parent ID.

    const newCommit = new CommitNode(message, [parentId]);

    // 3. Add the new commit to our `this.commits` hash map.

    this.commits.set(newCommit.id, newCommit);

    // 4. Update the branch pointer in `this.branches` to point to the new commit's ID.

    this.branches.set(this.HEAD, newCommit.id);
  }

  createBranch(branchName) {
    
    // 1. Get the ID of the commit that the current branch (this.HEAD) points to.
    const currentBID = this.branches.get(this.HEAD);

    // 2. Add a new entry to `this.branches`, mapping the new branchName to that commit ID.

    this.branches.set(branchName, currentBID)

  }

  checkout(branchName) {

    // 1. Check if the branch actually exists in our `this.branches` map.
    // 2. If it does not exist throw an error.
    // 3. Else checkout to that branch.

      if(!this.branches.has(branchName)){
        console.error(`Error: Branch "${branchName}" does not exist.`)
      } else {
        this.HEAD = branchName;
      }

  }

  merge(sourceBranchName) {
    // 1. Identify the target branch. This is the branch you are currently on (this.HEAD).

    const targetBranch = this.HEAD;
    
    // 2. Perform safety checks:
    //    a. Ensure the source branch exists.
    //    b. Ensure the source and target branches are not the same.

    if(!this.branches.has(sourceBranchName)){
      console.error(`Error: Branch "${sourceBranchName}" does not exist.`)
      return;
    }

    if(sourceBranchName==targetBranch){
      console.error('Error: Source and target branches are the same.')
      return;
    }

    
    // 3. Get the commit IDs for both the source and target branch tips.

    const targetId = this.branches.get(targetBranch);
    const sourceId = this.branches.get(sourceBranchName);

    if(targetId==sourceId){
      console.log("Branches are already up-to-date. Nothing to merge.");
      return;
    }

    // 4. Create a new merge commit. This is the key step:
    //    a. The message should be something like `Merge branch '${sourceBranchName}' into '${this.HEAD}'`.
    //    b. It will have TWO parents: the target branch ID and the source branch ID.

    const mergeCommit = new CommitNode(`Merged branch '${sourceBranchName}' into '${this.HEAD}'`, [targetId, sourceId]);

    // 5. Add the new merge commit to the `this.commits` map.

    this.commits.set(mergeCommit.id, mergeCommit);    

    // 6. Update the target branch pointer (`this.HEAD`) to point to the new merge commit.

    this.branches.set(targetBranch, mergeCommit.id);
  }

}