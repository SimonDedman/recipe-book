import { useState } from "react";
import recipes from "./recipes/index.js";
import RecipeViewer from "./components/RecipeViewer.jsx";

function RecipeCard({ recipe, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white rounded-xl border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all group"
    >
      <h2 className="text-lg font-bold text-stone-800 group-hover:text-stone-950">{recipe.title}</h2>
      <p className="text-sm text-stone-500 mt-1">{recipe.source}</p>
      <p className="text-xs text-stone-400 mt-2">{recipe.notes}</p>
      <div className="flex gap-3 mt-3 text-xs text-stone-500">
        <span>Base: {recipe.baseServings} servings</span>
        <span>·</span>
        <span>Scale: ×{recipe.multiplierOptions[0]}–×{recipe.multiplierOptions[recipe.multiplierOptions.length - 1]}</span>
      </div>
    </button>
  );
}

export default function App() {
  const [activeRecipe, setActiveRecipe] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Recipe Book</h1>
        <p className="text-stone-500 mt-1">Scalable recipes with prep timelines & dependency charts</p>
      </div>
      <div className="grid gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setActiveRecipe(recipe)} />
        ))}
      </div>
    </div>
  );
}
