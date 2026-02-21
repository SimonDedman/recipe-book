import { useState, useMemo } from "react";
import { fmtTime, fmtCountdown, ri } from "../recipes/schema.js";

const categoryColors = {
  prep: { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-800" },
  cook: { bg: "bg-red-100", border: "border-red-400", text: "text-red-800" },
};

function JobCard({ job, compact = false }) {
  const c = categoryColors[job.category] || categoryColors.prep;
  return (
    <div className={`${c.bg} ${c.border} border rounded px-2 py-1 ${compact ? "text-xs" : "text-sm"} inline-block`}>
      <span className={`font-mono font-bold ${c.text} mr-1`}>{job.id}</span>
      <span>{job.name}</span>
      <span className="text-gray-500 ml-1">({job.duration}m)</span>
    </div>
  );
}

function TimelineView({ schedule, jobs, title, description, prepPhaseEnd }) {
  const jobMap = {};
  jobs.forEach((j) => (jobMap[j.id] = j));
  const totalMins = schedule[schedule.length - 1].mins;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-sm text-stone-500 mb-4">{description}</p>
      <div className="flex items-center gap-3 p-2 mb-1 border-b border-stone-300">
        <div className="font-mono text-xs font-bold text-stone-400 w-14 shrink-0 text-center">Elapsed</div>
        <div className="font-mono text-xs font-bold text-stone-400 w-14 shrink-0 text-center">Left</div>
        <div className="flex-1 text-xs font-bold text-stone-400">Task</div>
      </div>
      <div className="space-y-1">
        {schedule.map((slot, i) => {
          const isGap = slot.note.includes("⭐");
          const isServe = slot.note.includes("🍽️");
          const isDone = slot.note.includes("✅");
          const isPrepPhase = slot.phase === "prep";
          let rowClass = "bg-stone-50";
          if (isGap) rowClass = "bg-green-50 border border-green-300";
          else if (isServe) rowClass = "bg-purple-50 border border-purple-300";
          else if (isDone) rowClass = "bg-blue-50 border border-blue-400";
          else if (isPrepPhase) rowClass = "bg-amber-50";

          let elapsedMins = slot.mins;
          if (prepPhaseEnd !== undefined && slot.phase === "cook") {
            elapsedMins = slot.mins - prepPhaseEnd;
          }
          const elapsed = fmtTime(elapsedMins);
          const remaining = totalMins - slot.mins;
          const countdown = remaining === 0 ? "T-0:00" : fmtCountdown(remaining);

          return (
            <div key={i} className={`flex items-start gap-3 p-2 rounded ${rowClass}`}>
              <div className="font-mono text-sm font-bold text-stone-600 w-14 shrink-0 text-center">
                {prepPhaseEnd !== undefined && isDone ? "—" : elapsed}
              </div>
              <div className="font-mono text-sm font-bold text-red-400 w-14 shrink-0 text-center">{countdown}</div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-1 mb-1">
                  {slot.tasks.map((tid, j) =>
                    jobMap[tid] ? <JobCard key={`${tid}-${j}`} job={jobMap[tid]} compact /> : null
                  )}
                </div>
                <div className={`text-xs ${isGap ? "text-green-700 font-semibold" : isDone ? "text-blue-700 font-semibold" : "text-stone-500"}`}>
                  {slot.note}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShoppingListView({ shoppingList }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-1">Shopping List</h2>
      <div className="space-y-4">
        {shoppingList.map((cat) => (
          <div key={cat.category} className="border border-stone-200 rounded-lg p-3">
            <div className="text-xs font-bold text-stone-500 mb-2 uppercase">{cat.category}</div>
            <div className="space-y-1">
              {cat.items.map((item, i) => (
                <div key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-mono font-bold text-stone-700 w-40 shrink-0">{item.amount}</span>
                  <span>{item.name}</span>
                  {item.note && <span className="text-xs text-stone-400">({item.note})</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DependencyChart({ deps, jobs, title, description }) {
  const jobMap = {};
  jobs.forEach((j) => (jobMap[j.id] = j));
  const steps = {};
  jobs.forEach((j) => {
    if (!steps[j.step]) steps[j.step] = [];
    steps[j.step].push(j);
  });

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-1">{title}</h2>
      <p className="text-sm text-stone-500 mb-4">{description}</p>
      <div className="space-y-4">
        {Object.entries(steps)
          .sort(([a], [b]) => a - b)
          .map(([step, sJobs]) => (
            <div key={step} className="border border-stone-200 rounded-lg p-3">
              <div className="text-xs font-bold text-stone-500 mb-2">STEP {step}</div>
              <div className="space-y-2">
                {sJobs.map((job) => (
                  <div key={job.id} className="flex items-start gap-2 flex-wrap">
                    <JobCard job={job} />
                    {deps[job.id] && deps[job.id].length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-stone-400 flex-wrap">
                        <span>←</span>
                        {deps[job.id].map((d) => (
                          <span key={d} className={`${categoryColors[jobMap[d]?.category || "prep"].bg} ${categoryColors[jobMap[d]?.category || "prep"].text} px-1 rounded font-mono font-bold`}>
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function AllJobsView({ jobs }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">All Jobs</h2>
      <div className="grid grid-cols-1 gap-1">
        {jobs.map((j) => (
          <div key={j.id} className="flex items-center gap-2">
            <JobCard job={j} compact />
            {j.note && <span className="text-xs text-stone-400">({j.note})</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 text-sm text-stone-500">
        Total prep: {jobs.filter((j) => j.category === "prep").reduce((a, j) => a + j.duration, 0)}m |{" "}
        Total cook: {jobs.filter((j) => j.category === "cook").reduce((a, j) => a + j.duration, 0)}m |{" "}
        Serial total: {jobs.reduce((a, j) => a + j.duration, 0)}m
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 mb-4 text-sm">
      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-500" /> Prep</div>
      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-500" /> Cook</div>
      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-500" /> Gap-fill</div>
      <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-400" /> Phase break</div>
    </div>
  );
}

export default function RecipeViewer({ recipe, onBack }) {
  const [tab, setTab] = useState("optimized");
  const [mult, setMult] = useState(2);
  const [servings, setServings] = useState(recipe.baseServings * 2);

  const handleMultChange = (newMult) => {
    setMult(newMult);
    setServings(Math.round(newMult * recipe.baseServings));
  };
  const handleServingsChange = (newServings) => {
    setServings(newServings);
    setMult(newServings / recipe.baseServings);
  };

  const jobs = useMemo(() => recipe.buildJobs(mult), [mult, recipe]);
  const shoppingList = useMemo(() => recipe.buildShoppingList(mult), [mult, recipe]);
  const optimizedSchedule = useMemo(() => recipe.buildOptimizedSchedule(jobs), [jobs, recipe]);
  const { schedule: prePrepSched, prepEnd } = useMemo(() => recipe.buildPrePrepSchedule(jobs), [jobs, recipe]);

  const optimizedTotal = optimizedSchedule[optimizedSchedule.length - 1].mins;
  const prePrepTotal = prePrepSched[prePrepSched.length - 1].mins;

  const tabs = [
    ["shopping", "🛒 Shopping"],
    ["optimized", "⭐ Optimized"],
    ["preprep", "🔪 Pre-Prep"],
    ["jobs", "All Jobs"],
    ["strict", "Strict Deps"],
    ["opt-deps", "True Deps"],
  ];

  const cans = ri(1, mult);

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        {onBack && (
          <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-800 mb-2 flex items-center gap-1">
            ← All Recipes
          </button>
        )}
        <h1 className="text-2xl font-bold mb-1">{recipe.title}</h1>
        <p className="text-sm text-stone-500">{recipe.source}</p>
        <p className="text-sm text-stone-400 mt-1">{recipe.notes}</p>
      </div>

      {/* Scale controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-stone-100 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-700">Multiplier:</label>
          <select
            value={mult}
            onChange={(e) => handleMultChange(parseFloat(e.target.value))}
            className="border border-stone-300 rounded px-2 py-1 text-sm font-bold bg-white"
          >
            {recipe.multiplierOptions.map((m) => (
              <option key={m} value={m}>×{m}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-stone-700">Servings:</label>
          <select
            value={servings}
            onChange={(e) => handleServingsChange(parseInt(e.target.value))}
            className="border border-stone-300 rounded px-2 py-1 text-sm font-bold bg-white"
          >
            {Array.from(
              { length: recipe.servingsRange[1] - recipe.servingsRange[0] + 1 },
              (_, i) => i + recipe.servingsRange[0]
            ).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-stone-500">
          {cans} {cans > 1 ? "cans" : "can"} tomatoes · {Math.ceil(mult)} large ziploc{Math.ceil(mult) > 1 ? "s" : ""}
        </div>
      </div>

      <Legend />

      {/* Sticky tabs */}
      <div className="sticky top-0 z-10 bg-stone-50 pb-2 pt-1">
        <div className="flex flex-wrap gap-2">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                tab === key ? "bg-stone-800 text-white" : "bg-stone-200 text-stone-600 hover:bg-stone-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {tab === "shopping" && <ShoppingListView shoppingList={shoppingList} />}
        {tab === "jobs" && <AllJobsView jobs={jobs} />}
        {tab === "strict" && (
          <DependencyChart deps={recipe.deps.strict} jobs={jobs} title="Strict Dependencies" description="Traditional mise en place: all prep before cooking." />
        )}
        {tab === "opt-deps" && (
          <DependencyChart deps={recipe.deps.optimized} jobs={jobs} title="True Dependencies" description="Only actual prerequisites." />
        )}
        {tab === "optimized" && (
          <TimelineView
            schedule={optimizedSchedule}
            jobs={jobs}
            title="Optimized Timeline"
            description={`Parallelized, filling gaps. ⭐ = dead time. Wall clock: ~${fmtTime(optimizedTotal)}.`}
          />
        )}
        {tab === "preprep" && (
          <TimelineView
            schedule={prePrepSched}
            jobs={jobs}
            title="Full Pre-Prep Timeline"
            description={`All prep before oven. Zero multitasking. Wall clock: ~${fmtTime(prePrepTotal)}. Elapsed resets at cook phase.`}
            prepPhaseEnd={prepEnd}
          />
        )}
      </div>
    </div>
  );
}
