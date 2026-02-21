import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "slow-tomato-sauce",
  title: "The Best Slow-Cooked Tomato Sauce",
  source: "Serious Eats",
  cuisine: "Italian",
  image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&h=300&fit=crop",
  baseServings: 8,
  multiplierOptions: [1, 1.5, 2],
  servingsRange: [4, 16],
  notes: "Makes ~2 quarts. 6-hour oven cook at 300°F. Active time only 20 mins. Freezes 6 months.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const tomatoCans = ri(4, mult);
    return [
      { category: "Canned/Jarred", items: [
        { name: "Whole peeled tomatoes, 28 oz / 795g can (San Marzano DOP preferred)", amount: `${tomatoCans} ${pl(tomatoCans, "can")}` },
        { name: "Fish sauce (optional)", amount: `${si(1)} tbsp` },
      ]},
      { category: "Produce", items: [
        { name: "Garlic cloves", amount: `${si(8)}`, note: "Minced" },
        { name: "Medium carrot", amount: `${si(1)}`, note: "Cut into large chunks" },
        { name: "Medium onion", amount: `${si(1)}`, note: "Halved" },
        { name: "Fresh basil", amount: `${si(1)} large stem` },
        { name: "Fresh parsley or basil", amount: `${sf(0.5)} cup minced`, note: "Stirred in at end" },
      ]},
      { category: "Oils & Vinegars", items: [
        { name: "EVOO", amount: `${sf(0.25)} cup plus more for finishing` },
      ]},
      { category: "Dairy", items: [
        { name: "Butter", amount: `${si(4)} tbsp (${s(57)}g)` },
      ]},
      { category: "Spices & Condiments", items: [
        { name: "Red pepper flakes", amount: `${si(1)} tsp` },
        { name: "Dried oregano", amount: `${si(1)} tbsp` },
        { name: "Kosher salt", amount: "To taste" },
        { name: "Black pepper", amount: "To taste" },
      ]},
      { category: "Equipment/Supplies", items: [
        { name: "Large oven-safe pot or Dutch oven", amount: "1" },
        { name: "Large deli or bowl (for reserved tomatoes)", amount: `${si(1)}` },
        { name: "Quart containers for storage", amount: `${si(2)}` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const tomatoCans = ri(4, mult);

    return [
      { id: "P1", name: `Preheat oven to 300°F (150°C)`, duration: 1, category: "prep", step: 1, note: "~15 min to heat" },
      { id: "P2", name: `Open ${tomatoCans} ${pl(tomatoCans, "can")} whole peeled tomatoes; crush ${ri(3, mult)} cups worth by hand into large bowl; reserve remaining ${ri(1, mult)} cup(s) crushed in fridge for finishing`, duration: prepScale(8, mult), category: "prep", step: 1 },
      { id: "P3", name: `Mince ${si(8)} garlic ${pl(si(8), "clove")}`, duration: prepScale(3, mult), category: "prep", step: 2 },
      { id: "P4", name: `Cut ${si(1)} ${pl(si(1), "carrot")} into large chunks; halve ${si(1)} ${pl(si(1), "onion")}`, duration: prepScale(3, mult), category: "prep", step: 2 },
      { id: "P5", name: `Measure ${sf(0.25)} cup EVOO, ${si(4)} tbsp butter, ${si(1)} tsp red pepper flakes, ${si(1)} tbsp dried oregano`, duration: 2, category: "prep", step: 2 },
      { id: "C1", name: `Heat ${sf(0.25)} cup EVOO + ${si(4)} tbsp butter in Dutch oven over medium heat until butter melts`, duration: 3, category: "cook", step: 1 },
      { id: "C2", name: `Cook ${si(8)} minced garlic 2 min until fragrant but not browned`, duration: 2, category: "cook", step: 1 },
      { id: "C3", name: `Add ${si(1)} tsp red pepper flakes + ${si(1)} tbsp oregano; stir 30 seconds`, duration: 1, category: "cook", step: 2 },
      { id: "C4", name: `Add crushed tomatoes, carrot chunks, onion halves, basil stem; stir and bring to simmer`, duration: 5, category: "cook", step: 2 },
      { id: "C5", name: `Uncovered in oven at 300°F — cook 5-6 hours, stirring every 1-2 hours; sauce should reduce by half`, duration: mult > 1 ? 360 : 330, category: "cook", step: 3, note: "Stir every 1-2h; aim for thick, jammy consistency" },
      { id: "C6", name: `Remove from oven; discard onion halves, carrot chunks, basil stem`, duration: 3, category: "cook", step: 4 },
      { id: "C7", name: `Stir in reserved crushed tomatoes, ${si(1)} tbsp fish sauce (optional), ${sf(0.5)} cup minced fresh parsley/basil`, duration: 3, category: "cook", step: 4 },
      { id: "C8", name: `Finish with drizzle of EVOO; season with salt & black pepper to taste`, duration: 2, category: "cook", step: 5 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2"], `Turn on oven to 300°F (150°C). ${j("P2").name}`);
    t += Math.max(j("P1").duration, j("P2").duration);
    push(["P3", "P4"], `${j("P3").name}. ${j("P4").name}`);
    t += Math.max(j("P3").duration, j("P4").duration);
    push(["P5"], j("P5").name);
    t += j("P5").duration;
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], j("C3").name);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], "Uncovered into oven at 300°F");
    push([], `⭐ GAP: ${j("C5").duration} min oven cook — stir every 1-2h, otherwise free`);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push(["C8"], j("C8").name);
    t += j("C8").duration;
    push([], "🍽️ SERVE immediately or cool and refrigerate/freeze");
    return sched;
  },

  buildPrePrepSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note, phase) => { sched.push({ mins: t, tasks, note, phase }); };

    // This recipe is all done in one session (no meaningful pre-prep separation),
    // but we follow the standard pattern: all prep jobs first, then cook.
    push(["P2"], j("P2").name, "prep");
    t += j("P2").duration;
    push(["P3"], j("P3").name, "prep");
    t += j("P3").duration;
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    push(["P5"], j("P5").name, "prep");
    t += j("P5").duration;
    const prepEnd = t;
    push([], "✅ ALL PREP DONE — ready to cook", "prep");

    push(["P1"], j("P1").name, "cook");
    t += j("P1").duration;
    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], j("C3").name, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], `Uncovered into oven at 300°F — ${j("C5").duration} min, stir every 1-2h`, "cook");
    t += j("C5").duration;
    push(["C6"], j("C6").name, "cook");
    t += j("C6").duration;
    push(["C7"], j("C7").name, "cook");
    t += j("C7").duration;
    push(["C8"], j("C8").name, "cook");
    t += j("C8").duration;
    push([], "🍽️ SERVE or cool and freeze in quart containers", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1", "P3", "P4", "P5"],
      C2: ["C1", "P3"], C3: ["C2"],
      C4: ["C3", "P2", "P4"],
      C5: ["C4", "P1"], C6: ["C5"],
      C7: ["C6", "P2"], C8: ["C7"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P5"],
      C2: ["C1", "P3"], C3: ["C2"],
      C4: ["C3", "P2", "P4"],
      C5: ["C4", "P1"], C6: ["C5"],
      C7: ["C6", "P2"], C8: ["C7"],
    },
  },
};

export default recipe;
