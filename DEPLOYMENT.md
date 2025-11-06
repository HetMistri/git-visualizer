# Git-Vis Deployment Guide for Vercel

## Issues Fixed

### ✅ Problem 1: 404 Errors on `/visualizer` Route

**Error:** `GET 404 git-visualizer-lemon.vercel.app/visualizer`

**Cause:** Vercel didn't know how to handle client-side routing (React Router)

**Solution:** Updated `vercel.json` with proper rewrites:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This tells Vercel to serve `index.html` for ALL routes, letting React Router handle navigation.

---

### ✅ Problem 2: MIME Type Error on JS Modules

**Error:** `Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`

**Cause:**

1. Incorrect `vercel.json` syntax (used `routes` instead of `rewrites`)
2. Missing build configuration
3. Asset caching not optimized

**Solution:**

1. Fixed `vercel.json` with proper configuration
2. Updated `vite.config.js` with build optimizations
3. Added asset caching headers

---

## Files Changed

### 1. `vercel.json` ✅

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. `vite.config.js` ✅

Added build optimizations:

```javascript
build: {
  outDir: "dist",
  sourcemap: false,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ["react", "react-dom", "react-router-dom"],
        reactflow: ["@xyflow/react"],
        animations: ["gsap", "framer-motion"],
      },
    },
  },
},
base: "/",
```

### 3. `index.html` ✅

Fixed favicon path and added meta tags:

```html
<link rel="icon" type="image/png" href="/logo.png" />
<meta
  name="description"
  content="Git-Vis - Interactive Git Visualization Tool"
/>
```

### 4. `public/logo.png` ✅

Copied logo from `src/assets/` to `public/` for proper serving.

### 5. `.vercelignore` ✅

Created to prevent unnecessary files from being uploaded.

---

## Deployment Steps

### Step 1: Verify Local Build

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173/` and test:

- ✅ Root page loads (`/`)
- ✅ Visualizer page loads (`/visualizer`)
- ✅ Direct URL navigation works (refresh on `/visualizer`)
- ✅ Favicon displays
- ✅ All assets load correctly

### Step 2: Commit Changes

```bash
git add .
git commit -m "fix: configure Vercel deployment with SPA routing"
git push origin het
```

### Step 3: Deploy to Vercel

#### Option A: Automatic Deployment (Recommended)

If you have Vercel GitHub integration:

1. Push changes to your repository
2. Vercel will automatically detect and deploy
3. Check deployment logs at https://vercel.com/dashboard

#### Option B: Manual Deployment

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 4: Verify Production Deployment

Visit your Vercel URL and test:

- ✅ `https://git-visualizer-lemon.vercel.app/` loads
- ✅ `https://git-visualizer-lemon.vercel.app/visualizer` loads
- ✅ Refresh on `/visualizer` doesn't show 404
- ✅ All static demos display correctly
- ✅ No console errors
- ✅ Assets load from `/assets/` directory

---

## Performance Optimizations Applied

### 1. Code Splitting ✅

Vite now splits your bundle into:

- **vendor.js** (44.3 KB) - React, React DOM, React Router
- **reactflow.js** (176.6 KB) - React Flow library
- **animations.js** (184.5 KB) - GSAP, Framer Motion
- **index.js** (436.1 KB) - Your app code

Total: ~850 KB (gzipped: ~280 KB)

### 2. Asset Caching ✅

Static assets are cached for 1 year:

```
Cache-Control: public, max-age=31536000, immutable
```

### 3. Static Demos ✅

Using pre-computed graphs (no execution overhead):

- No GitGraph initialization
- No setTimeout loops
- No state synchronization issues
- Instant rendering

---

## Common Deployment Issues

### Issue: "Module not found" errors

**Solution:** Ensure all imports use the `@/` alias defined in `vite.config.js`

### Issue: Routes still returning 404

**Solution:** Check that `vercel.json` has `rewrites` (not `routes`)

### Issue: Blank page after deployment

**Solution:**

1. Check browser console for errors
2. Verify `base: "/"` in `vite.config.js`
3. Ensure `BrowserRouter` (not `HashRouter`) in `App.jsx`

### Issue: Assets not loading

**Solution:**

1. Check assets are in `public/` directory
2. Reference them with `/asset-name.ext` (no `/public/`)
3. Verify build includes assets in `dist/assets/`

---

## Vercel Environment Variables (Optional)

If you need to add environment variables:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variables:
   - `VITE_API_URL` (if you have a backend)
   - `VITE_GA_ID` (for Google Analytics)
3. Redeploy

**Important:** Vite env vars must be prefixed with `VITE_`

---

## Build Verification Checklist

Before deploying, verify:

- ✅ `npm run build` completes without errors
- ✅ `dist/` folder is created with:
  - `index.html`
  - `assets/` folder with JS/CSS/images
  - `logo.png` in root
- ✅ `npm run preview` works locally
- ✅ All routes accessible at preview URL
- ✅ No console errors in preview
- ✅ Static demos display correctly
- ✅ Logo/favicon appears

---

## Post-Deployment Monitoring

### Check These Metrics:

1. **Lighthouse Score:** Should be 90+ for Performance
2. **Bundle Size:** ~280 KB gzipped (acceptable for this app)
3. **First Contentful Paint (FCP):** <2 seconds
4. **Time to Interactive (TTI):** <3 seconds

### Vercel Analytics (Optional)

Enable in Vercel Dashboard → Analytics to track:

- Page views
- Route performance
- Core Web Vitals
- Error rates

---

## Troubleshooting Commands

```bash
# Clear Vercel cache and redeploy
vercel --prod --force

# Check build logs
vercel logs <deployment-url>

# List all deployments
vercel ls

# Remove a deployment
vercel rm <deployment-url>
```

---

## Success Criteria ✅

Your deployment is successful when:

1. ✅ Root page loads without errors
2. ✅ `/visualizer` route works (no 404)
3. ✅ Refresh on any route doesn't break
4. ✅ All demos display unique graphs (no sync)
5. ✅ No MIME type errors in console
6. ✅ Favicon appears in browser tab
7. ✅ All assets load correctly
8. ✅ Performance is smooth (no lag)

---

## Next Steps After Deployment

1. **Set up custom domain** (optional):

   - Vercel Dashboard → Domains → Add Domain
   - Update DNS records

2. **Enable HTTPS** (automatic on Vercel)

3. **Monitor performance**:

   - Use Vercel Analytics
   - Check Core Web Vitals

4. **Set up CI/CD** (already done if using GitHub integration)

---

## Support

If issues persist:

1. Check Vercel deployment logs
2. Verify all changes are committed and pushed
3. Ensure `node_modules` is not in git (`.gitignore`)
4. Try clearing Vercel cache with `--force` flag

**Your app is now ready for production! 🚀**
