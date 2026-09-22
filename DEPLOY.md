# Deployment

Static SPA — any host with SPA rewrites works.

## Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```
vercel.json is already configured with SPA rewrites.

## Netlify
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```
netlify.toml is already configured.

## GitHub Pages
Set base in vite.config.js to "/<repo-name>/", then use gh-pages:
```bash
npm i -D gh-pages
npm run build && npx gh-pages -d dist
```

## Docker
```bash
docker build -t egy-skills .
docker run -p 8080:80 egy-skills
```
