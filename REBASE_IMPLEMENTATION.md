# Rebase Implementation - Correct Git Semantics

## Core Concept

**Rebase rewrites history by creating NEW commits on top of a target branch.**

The original commits are discarded (orphaned), and new commits with new IDs are created.

## Example Scenario

### Before Rebase:

```
main:     Initial → Fix Patch 1
              \
frontend:       Feat: add X → Feat: add Y → Feat: add Z
```

### Command:

```javascript
git.rebase("frontend", "main");
```

### After Rebase:

```
main:     Initial → Fix Patch 1
                         \
frontend:                  Feat: add X' → Feat: add Y' → Feat: add Z'
```

**Key Points:**

- X', Y', Z' are **NEW commits** with **NEW IDs**
- They are **NOT** on main branch - they belong to frontend
- The original X, Y, Z are **orphaned** and will be garbage collected
- Main branch **remains unchanged** (its pointer doesn't move)

## Implementation Details

### 1. Logical Implementation (gitGraph.js)

```javascript
rebase(sourceBranchName, targetBranchName) {
  // 1. Find commits unique to source branch (not in target history)
  // 2. Mark old commits as orphaned
  // 3. Create NEW commits with:
  //    - Same message as old commits
  //    - New IDs
  //    - createdByBranch = sourceBranchName (IMPORTANT!)
  //    - Parent chain starting from target tip
  // 4. Move source branch pointer to last new commit
  // 5. Checkout source branch
}
```

**Critical:** New commits have `createdByBranch = sourceBranchName`

- This ensures they keep the source branch's color
- This ensures they are tagged as belonging to the source branch
- They do NOT belong to the target branch

### 2. Visual Implementation

#### Node Colors:

- **Old commits (before rebase):** Source branch color (e.g., green for frontend)
- **New commits (after rebase):** Same source branch color (green for frontend)
- **Orphaned commits:** Greyed out, dashed border, ORPHANED label

#### Branch Badges:

- **New commits:** Only show branches whose tip points to them
- If frontend pointer is at Z', only Z' shows "frontend" badge
- Main's tip shows "main" badge

#### Position:

- New commits are placed **on top of target branch's tip**
- They appear linearly after the target branch
- But they are visually distinct (source branch color)

### 3. Animation (useRebaseAnimation.js)

During rebase animation:

1. **Old commits fade out** (orphaned)
2. **New commits fade in** at new positions
3. Visual effect: commits "lift off" and "move" to target tip
4. Color remains consistent (source branch color)

## What Users See

### Before Rebase:

- Frontend (green): Diverged from main with commits X, Y, Z
- Main (blue): Has its own commit "Fix Patch 1"
- Two parallel timelines

### During Animation:

- Frontend commits appear to "move"
- Old positions fade out
- New positions fade in on top of main

### After Rebase:

- Frontend (green) commits now build on top of main's tip
- Main (blue) unchanged
- Frontend commits maintain green color
- Old commits disappear (or shown greyed as orphaned)

## Common Misconceptions (Corrected)

### ❌ Wrong: "Rebased commits appear on both branches"

✅ Correct: Rebased commits belong ONLY to the source branch

### ❌ Wrong: "Main branch gets new commits"

✅ Correct: Main stays unchanged. Source branch gets new commits built on main's tip.

### ❌ Wrong: "Rebased commits should be target branch color"

✅ Correct: Rebased commits keep source branch color (createdByBranch)

### ❌ Wrong: "Old commits remain visible"

✅ Correct: Old commits are orphaned and fade out (or garbage collected)

## Visual Checklist

After rebase, verify:

- [ ] New commits have source branch color (e.g., green for frontend)
- [ ] New commits show correct branch badges (only source branch)
- [ ] Old commits are marked ORPHANED (greyed, dashed)
- [ ] Target branch pointer unchanged
- [ ] Source branch pointer moved to last new commit
- [ ] New commits positioned on top of target branch tip
- [ ] Animation shows smooth transition (fade out old, fade in new)

## Code References

### Core Logic:

- `src/core/gitGraph.js` - `rebase()` function
  - Creates new commits with `createdByBranch = sourceBranchName`
  - Marks old commits as orphaned

### Visual Rendering:

- `src/utils/graphLayout.js` - `convertToReactFlow()`
  - Uses `commit.createdByBranch` for color assignment
  - Filters orphaned commits or marks them visually

### Animation:

- `src/hooks/useRebaseAnimation.js` - `animateRebase()`
  - Fades out old commits
  - Fades in new commits at new positions

## Testing

To verify correct implementation:

```javascript
// 1. Create branches
git.createBranch("frontend");
git.checkout("frontend");
git.commit("Feat: add X");
git.commit("Feat: add Y");
git.commit("Feat: add Z");

git.checkout("main");
git.commit("Fix Patch 1");

// 2. Rebase
git.rebase("frontend", "main");

// 3. Verify:
// - Frontend commits are on top of main's tip
// - Frontend commits are green (if frontend is green)
// - Main is unchanged
// - Old commits are orphaned
// - New commits have new IDs
```

## Result

After proper implementation:

- ✅ Rebased commits maintain source branch identity (color, tag)
- ✅ Rebased commits appear linearly on top of target
- ✅ Target branch remains untouched
- ✅ History is cleanly rewritten
- ✅ Visual feedback matches Git's actual behavior
