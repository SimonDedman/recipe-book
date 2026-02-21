# Recipe Book

Scalable recipe planner with prep timelines, dependency charts, and shopping lists. Built with React + Vite, deployed to GitHub Pages.

## Live Site

https://simondedman.github.io/recipe-book/

## Features

- **Dynamic scaling**: Multiplier (×1–×4) and servings dropdowns auto-recalculate everything
- **Optimized timeline**: Parallelized prep filling dead time gaps
- **Full pre-prep timeline**: All prep before cooking, elapsed resets at cook phase
- **Dependency charts**: Strict (mise en place) and true (minimum) prerequisites
- **Shopping list**: Grouped by category, scaled to multiplier
- **Mobile-friendly**: Sticky tab bar, responsive layout

## Adding a New Recipe

1. Create `src/recipes/your-recipe.js` following the schema in `src/recipes/schema.js`
2. Import and add to the array in `src/recipes/index.js`
3. Push to `main` — GitHub Actions auto-deploys

### Recipe Schema

Each recipe exports an object with:
- `id`, `title`, `source`, `baseServings`, `multiplierOptions`, `servingsRange`, `notes`
- `buildShoppingList(mult)` → array of category groups
- `buildJobs(mult)` → array of prep/cook tasks with durations
- `buildOptimizedSchedule(jobs)` → parallelized timeline
- `buildPrePrepSchedule(jobs)` → { schedule, prepEnd }
- `deps` → { strict, optimized } dependency maps

See `src/recipes/jambalaya.js` as the reference implementation.

## Development

```bash
npm install
npm run dev     # localhost:5173
npm run build   # build to dist/
```

## Deployment

Push to `main` triggers GitHub Actions → builds → deploys to GitHub Pages automatically.

### First-time setup:
1. Create repo `recipe-book` on GitHub
2. Go to Settings → Pages → Source: **GitHub Actions**
3. Push code — the workflow handles the rest
