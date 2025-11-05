# Converting Demo Components to GIF/Static Images

This guide explains how to capture the static demo visualizations as GIF files for optimal performance.

## Why Static Demos?

The old demos (`CommitDemo`, `BranchingDemo`, etc.) executed full Git command sequences with setTimeout delays, creating multiple GitGraph instances and triggering re-renders. This caused:

- **Sync issues**: All demos mirroring the same state
- **Performance overhead**: Heavy computation for showcase components
- **Unnecessary complexity**: Full Git logic for static displays

The new static demos (`StaticCommitDemo`, `StaticBranchingDemo`, etc.) use pre-computed node/edge data with no execution logic, eliminating both issues.

## Current Implementation

✅ **Done**: Created static React components with pre-computed graphs

- `StaticCommitDemo.jsx` - 6 sequential commits
- `StaticBranchingDemo.jsx` - Multi-branch workflow
- `StaticMergeDemo.jsx` - Merge operations
- `StaticTestSequenceDemo.jsx` - Complex test workflow

✅ **Done**: Updated landing page to use static components

- `Hero.jsx` now uses `<StaticTestSequenceDemo />`
- `Features.jsx` now uses static demos in FEATURES array

## Option 1: Keep Static React Components (Current)

**Pros:**

- Interactive (pan, zoom still available but disabled)
- Retains React Flow styling
- Easy to update

**Cons:**

- Still loads React Flow library
- ~50-100KB per demo component

**Performance:** ⚡⚡⚡ (Good - much better than live execution)

---

## Option 2: Convert to GIF/Video (Recommended)

For maximum performance, capture these static demos as GIF or video files.

### Step 1: Capture Demos as GIF

#### Method A: Using Browser DevTools + ScreenToGif (Windows)

1. **Install ScreenToGif**: https://www.screentogif.com/
2. **Run dev server**: `npm run dev`
3. **Navigate to each demo page** (you may need to create isolated pages)
4. **Record with ScreenToGif**:
   - Select the demo window area
   - Record for 2-3 seconds (static image)
   - Save as GIF with optimized settings
5. **Save files**:
   ```
   public/demos/commit-demo.gif
   public/demos/branching-demo.gif
   public/demos/merge-demo.gif
   public/demos/test-sequence-demo.gif
   ```

#### Method B: Using Puppeteer (Automated)

Create `scripts/capture-demos.js`:

```javascript
import puppeteer from "puppeteer";
import { spawn } from "child_process";

async function captureDemos() {
  // Start dev server
  const server = spawn("npm", ["run", "dev"]);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 600 });

  const demos = [
    { name: "commit", url: "http://localhost:5173/demo/commit" },
    { name: "branching", url: "http://localhost:5173/demo/branching" },
    { name: "merge", url: "http://localhost:5173/demo/merge" },
    { name: "test-sequence", url: "http://localhost:5173/demo/test-sequence" },
  ];

  for (const demo of demos) {
    await page.goto(demo.url);
    await page.waitForSelector(".demo-graph");
    await page.screenshot({
      path: `public/demos/${demo.name}-demo.png`,
      fullPage: false,
    });
  }

  await browser.close();
  server.kill();
}

captureDemos();
```

Run: `node scripts/capture-demos.js`

#### Method C: Using CloudConvert or Ezgif (Online)

1. Take PNG screenshots of each demo
2. Upload to https://ezgif.com/png-to-gif
3. Add 3-second delay
4. Optimize and download

### Step 2: Create Image-Based Demo Components

Replace static React components with simple image/GIF display:

**Example: `src/features/visualizer/components/DemoShowcase/GifCommitDemo.jsx`**

```jsx
import "./DemoShowcase.css";

export const GifCommitDemo = () => {
  return (
    <div className="demo-container">
      <div className="demo-graph">
        <img
          src="/demos/commit-demo.gif"
          alt="Git commit visualization showing sequential commits on main branch"
          className="demo-gif"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default GifCommitDemo;
```

**Add to `DemoShowcase.css`:**

```css
.demo-gif {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
```

### Step 3: Update Imports

**In `index.js`:**

```javascript
// Super lightweight GIF-based demos
export { default as GifCommitDemo } from "./GifCommitDemo";
export { default as GifBranchingDemo } from "./GifBranchingDemo";
export { default as GifMergeDemo } from "./GifMergeDemo";
export { default as GifTestSequenceDemo } from "./GifTestSequenceDemo";
```

**In `Hero.jsx` and `Features.jsx`:**

```javascript
import {
  GifTestSequenceDemo,
  GifCommitDemo,
  GifBranchingDemo,
  GifMergeDemo,
} from "@/features/visualizer";
```

### Performance Comparison

| Type           | Bundle Size | Runtime Cost                  | Sync Issues |
| -------------- | ----------- | ----------------------------- | ----------- |
| Live Execution | ~200KB      | High (setTimeout, re-renders) | ❌ Yes      |
| Static React   | ~100KB      | Low (pre-computed)            | ✅ No       |
| GIF/Image      | ~20-50KB    | Minimal (just img tag)        | ✅ No       |

---

## Optimization Tips

### For GIFs:

1. **Limit colors**: 64-128 colors max
2. **Optimize frame rate**: 10-15 FPS for static
3. **Use tools**: ImageOptim, TinyPNG, Ezgif optimizer
4. **Target size**: <500KB per GIF

### For PNGs:

1. **Use WebP**: Better compression than PNG
2. **Responsive images**: Use `srcset` for different screens
3. **Lazy loading**: `loading="lazy"` attribute

### Example WebP Implementation:

```jsx
<picture>
  <source srcset="/demos/commit-demo.webp" type="image/webp" />
  <img src="/demos/commit-demo.png" alt="Commit demo" loading="lazy" />
</picture>
```

---

## Recommendation

**For Production:**

1. ✅ Use current `Static*Demo` components for now (already done)
2. ✅ Test performance - if acceptable, stop here
3. ⚠️ If you need extreme optimization, convert to GIF/WebP using Method A or B above

**Benefits of Current Static Approach:**

- ✅ No sync issues (eliminated)
- ✅ No computation overhead (eliminated)
- ✅ Still looks native (React Flow styling preserved)
- ✅ Easy to maintain (just update node/edge data)

**When to Convert to GIF:**

- Landing page loads slowly on mobile
- Want to reduce bundle size by ~80KB per demo
- Don't need any interactivity

---

## Files Changed

✅ Created:

- `src/features/visualizer/components/DemoShowcase/StaticCommitDemo.jsx`
- `src/features/visualizer/components/DemoShowcase/StaticBranchingDemo.jsx`
- `src/features/visualizer/components/DemoShowcase/StaticMergeDemo.jsx`
- `src/features/visualizer/components/DemoShowcase/StaticTestSequenceDemo.jsx`

✅ Updated:

- `src/features/visualizer/components/DemoShowcase/index.js` (exports)
- `src/features/landing/components/Hero/Hero.jsx` (uses StaticTestSequenceDemo)
- `src/features/landing/components/Features/Features.jsx` (uses Static\*Demo)

📝 Old files kept for reference:

- `CommitDemo.jsx`, `BranchingDemo.jsx`, `MergeDemo.jsx`, `TestSequenceDemo.jsx`
- Can be deleted once verified static versions work correctly
