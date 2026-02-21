import { useState } from "react";
import recipes from "./recipes/index.js";
import RecipeViewer from "./components/RecipeViewer.jsx";

const CUISINE_ORDER = [
  "Chili & Tex-Mex",
  "Mexican",
  "Italian",
  "Cajun & Creole",
  "Thai",
  "Indian",
  "Spanish",
  "Caribbean",
  "Latin American",
];

function RecipeCard({ recipe, onClick }) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex bg-white rounded-xl border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all group overflow-hidden"
    >
      <div className="w-32 h-32 flex-shrink-0 bg-stone-100 overflow-hidden">
        {recipe.image && !imgError ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
        )}
      </div>
      <div className="flex-1 p-4 min-w-0">
        <h2 className="text-lg font-bold text-stone-800 group-hover:text-stone-950">{recipe.title}</h2>
        <p className="text-sm text-stone-500 mt-1">{recipe.source}</p>
        <p className="text-xs text-stone-400 mt-2 line-clamp-1">{recipe.notes}</p>
        <div className="flex gap-3 mt-2 text-xs text-stone-500">
          <span>Base: {recipe.baseServings} servings</span>
          <span>·</span>
          <span>Scale: ×{recipe.multiplierOptions[0]}–×{recipe.multiplierOptions[recipe.multiplierOptions.length - 1]}</span>
        </div>
      </div>
    </button>
  );
}

export default function App() {
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisines");

  // If only one recipe, go straight to it
  if (recipes.length === 1 && !activeRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <RecipeViewer recipe={recipes[0]} />
      </div>
    );
  }

  if (activeRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <RecipeViewer recipe={activeRecipe} onBack={() => setActiveRecipe(null)} />
      </div>
    );
  }

  // Count recipes per cuisine
  const cuisineCounts = {};
  for (const r of recipes) {
    cuisineCounts[r.cuisine] = (cuisineCounts[r.cuisine] || 0) + 1;
  }

  // Filter and group
  const visibleCuisines = cuisineFilter === "All Cuisines"
    ? CUISINE_ORDER
    : [cuisineFilter];

  const groupedRecipes = visibleCuisines
    .map((cuisine) => ({
      cuisine,
      recipes: recipes.filter((r) => r.cuisine === cuisine),
    }))
    .filter((g) => g.recipes.length > 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Recipe Book</h1>
        <p className="text-stone-500 mt-1">Scalable recipes with prep timelines & dependency charts</p>
      </div>

      <div className="mb-6">
        <select
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        >
          <option>All Cuisines ({recipes.length})</option>
          {CUISINE_ORDER.filter((c) => cuisineCounts[c]).map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine} ({cuisineCounts[cuisine]})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-8">
        {groupedRecipes.map(({ cuisine, recipes: group }) => (
          <div key={cuisine}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-semibold text-stone-700">{cuisine}</h2>
              <div className="flex-1 border-t border-stone-200" />
              <span className="text-sm text-stone-400">{group.length}</span>
            </div>
            <div className="grid gap-4">
              {group.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setActiveRecipe(recipe)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
