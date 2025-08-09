# cPanel Deployment Guide

This project supports dual deployment to both GitHub Pages and cPanel using Git Version Control.

## cPanel Git Version Control Setup

### 1. Repository Configuration
- **Repository URL**: `https://github.com/[username]/portfolio_blog.git`
- **Branch**: `main`
- **Deploy Path**: `public_html` (or your preferred directory)

### 2. Build Configuration
- **Build Command**: `npm run build:cpanel`
- **Build Path**: `out/`
- **Node.js Version**: 18.x (or latest LTS)

### 3. Environment Variables
Set these in cPanel's Git Version Control settings:
- `NODE_ENV=production`
- `DEPLOY_TARGET=cpanel`

### 4. Deployment Process
1. Push to `main` branch triggers automatic deployment
2. cPanel pulls latest code
3. Runs `npm ci` to install dependencies
4. Runs `npm run build:cpanel` to build for cPanel
5. Deploys `out/` directory contents to web root

## File Structure for cPanel
```
public_html/
├── index.html
├── about/
├── work/
├── _next/
└── ... (all static assets)
```

## Differences from GitHub Pages
- **Base Path**: No base path (served from root domain)
- **Asset Prefix**: No prefix (served from root)
- **URL Structure**: `https://yourdomain.com/` instead of `https://username.github.io/portfolio_blog/`

## Troubleshooting

### Build Issues
- Ensure Node.js version is 18+ in cPanel
- Check that all dependencies are in `package.json`
- Verify build command: `npm run build:cpanel`

### Path Issues
- If assets don't load, check `basePath` and `assetPrefix` in `next.config.ts`
- Ensure `DEPLOY_TARGET=cpanel` environment variable is set

### Performance
- Static files are served directly by web server
- No server-side rendering required
- Optimized for cPanel's Apache/Nginx configuration

## 4. Update GitHub Actions for Dual Deployment

Update your existing `.github/workflows/deploy.yml`:

```yaml:.github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

      - name: Build application for GitHub Pages
        run: npm run build:github
        env:
          NODE_ENV: production
          DEPLOY_TARGET: github

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: test-and-build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 5. cPanel Git Version Control Configuration

In your cPanel's Git Version Control:

1. **Repository URL**: `https://github.com/[your-username]/portfolio_blog.git`
2. **Branch**: `main`
3. **Deploy Path**: `public_html` (or your preferred directory)
4. **Build Command**: `npm run build:cpanel`
5. **Build Path**: `out/`
6. **Environment Variables**:
   - `NODE_ENV=production`
   - `DEPLOY_TARGET=cpanel`

## Key Benefits of This Setup

1. **Automatic Deployment**: Both platforms deploy on push to `main`
2. **Environment-Specific Config**: Different base paths for each platform
3. **Consistent Build Process**: Same codebase, different deployment targets
4. **No Conflicts**: Each platform uses its own build script
5. **Easy Testing**: You can test both builds locally

## Testing Locally

```bash
# Test GitHub Pages build
npm run build:github

# Test cPanel build  
npm run build:cpanel

# Compare the outputs
ls out/
```

This setup ensures that your portfolio blog will automatically deploy to both GitHub Pages and cPanel whenever you push to the main branch, with each platform getting the correct configuration for its hosting environment.
