# Deployment Pipeline

This project uses GitHub Actions for continuous integration and deployment to GitHub Pages.

## Workflow Overview

### CI Pipeline (`ci.yml`)
- **Triggers**: Push to `main`/`develop` branches, pull requests to `main`
- **Actions**: 
  - Install dependencies
  - Run tests (including accessibility tests)
  - Run linting
  - Build application
- **Purpose**: Ensure code quality before merging

### Deployment Pipeline (`deploy.yml`)
- **Triggers**: Push to `main` branch only
- **Actions**:
  - Run full CI pipeline
  - Build static export
  - Deploy to GitHub Pages
- **Purpose**: Automatic deployment to production

## Configuration

### Next.js Static Export
- `output: 'export'` - Generates static files
- `trailingSlash: true` - Required for GitHub Pages
- `images: { unoptimized: true }` - Required for static export

### GitHub Pages Setup
1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Ensure repository has proper permissions

## Local Testing

```bash
# Test the build process locally
npm run build

# Check the static output
ls out/
```

## Deployment URL
The site will be available at: `https://[username].github.io/[repository-name]/` 