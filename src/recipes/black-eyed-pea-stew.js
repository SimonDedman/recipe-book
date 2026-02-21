import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "black-eyed-pea-stew",
  title: "Hearty One-Pot Black-Eyed Pea Stew with Kale & Andouille",
  source: "Serious Eats",
  cuisine: "Cajun & Creole",
  image: "https://images.unsplash.com/premium_photo-1675798917853-11d04d997979?w=400&h=300&fit=crop",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [3, 12],
  notes: "One-pot stew, better next day. Active: 30 min. Total: 1h15. Stores 5 days fridge.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Andouille sausage", amount: `${s(12)} oz (${s(340)}g)`, note: "Sliced into ¼-inch rounds" },
        { name: "Salt pork or slab bacon", amount: `${s(6)} oz (${s(170)}g)`, note: "Cut into ½-inch lardons" },
      ]},
      { category: "Produce", items: [
        { name: "Leek (white and pale green only)", amount: `${si(1)} large, chopped` },
        { name: "Yellow onion", amount: `${si(1)} large, chopped` },
        { name: "Celery stalks", amount: `${si(2)}, diced` },
        { name: "Green bell pepper", amount: `${si(1)} large, chopped` },
        { name: "Jalapeño", amount: `${si(1)}, minced` },
        { name: "Garlic cloves", amount: `${si(3)}, thinly sliced` },
        { name: "Kale (any variety)", amount: `${si(1)} bunch`, note: "Stems removed, roughly chopped" },
      ]},
      { category: "Dry goods", items: [
        { name: "Dried black-eyed peas", amount: `${s(1)} lb (${s(450)}g)`, note: "No soaking required" },
        { name: "Extra-virgin olive oil", amount: `${si(1)} tbsp` },
      ]},
      { category: "Liquid/Canned", items: [
        { name: "Chicken stock", amount: `${si(2)} quarts (${s(1900)}ml)` },
        { name: "Apple cider vinegar", amount: `${sf(0.33)} cup (${s(80)}ml)`, note: "Stirred in at end" },
      ]},
      { category: "Spices", items: [
        { name: "Red pepper flakes", amount: `${sf(0.5)} tsp` },
        { name: "Bay leaves", amount: `${si(2)}` },
        { name: "Salt & black pepper", amount: "To taste" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Slice ${s(12)} oz (${s(340)}g) andouille into ¼-inch rounds`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P2", name: `Cut ${s(6)} oz (${s(170)}g) salt pork or slab bacon into ½-inch lardons`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P3", name: `Chop ${si(1)} leek (white + pale green only), ${si(1)} large onion, ${si(2)} celery ${pl(si(2), "stalk")}, ${si(1)} green bell pepper`, duration: prepScale(8, mult), category: "prep", step: 1 },
      { id: "P4", name: `Mince ${si(1)} jalapeño; thinly slice ${si(3)} garlic ${pl(si(3), "clove")}`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P5", name: `Remove kale stems; roughly chop leaves from ${si(1)} bunch`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "P6", name: `Measure ${s(1)} lb (${s(450)}g) dried black-eyed peas; rinse and check for debris`, duration: 2, category: "prep", step: 1 },
      { id: "C1", name: `Heat ${si(1)} tbsp EVOO in large pot or Dutch oven over medium-high heat`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Brown andouille and salt pork/bacon together, stirring occasionally, about 12 min`, duration: cookScale(12, mult, mult > 1.5 ? "batch" : "fixed"), category: "cook", step: 1, note: "Render fat until edges are caramelised" },
      { id: "C3", name: `Add leek, onion, celery, bell pepper, jalapeño, ${sf(0.5)} tsp red pepper flakes, and garlic; cook stirring 10 min until softened`, duration: 10, category: "cook", step: 2 },
      { id: "C4", name: `Add chopped kale in batches; stir until wilted, about 8 min`, duration: 8, category: "cook", step: 3 },
      { id: "C5", name: `Add ${s(1)} lb (${s(450)}g) black-eyed peas, ${si(2)} quarts (${s(1900)}ml) chicken stock, and ${si(2)} bay leaves; bring to boil`, duration: 5, category: "cook", step: 3 },
      { id: "C6", name: `Reduce to steady simmer; cook uncovered 45 min to 1h15, until peas are fully tender`, duration: 75, category: "cook", step: 3, note: "Stir occasionally; add water if stew gets too thick" },
      { id: "C7", name: `Remove bay leaves; stir in ${sf(0.33)} cup (${s(80)}ml) apple cider vinegar; season with salt and pepper to taste`, duration: 3, category: "cook", step: 4, note: "Better after overnight refrigeration — reheat gently" },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2"], `${j("P1").name}. ${j("P2").name}`);
    t += Math.max(j("P1").duration, j("P2").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    push(["P3", "P4", "P5", "P6"], `⭐ GAP: While meat browns — ${j("P3").name.toLowerCase()}. ${j("P4").name.toLowerCase()}. ${j("P5").name.toLowerCase()}. ${j("P6").name.toLowerCase()}`);
    t += j("C2").duration;
    push(["C3"], `${j("C3").name} (10 min)`);
    t += j("C3").duration;
    push(["C4"], `${j("C4").name} (8 min)`);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], `Reduce to simmer; cook uncovered ${j("C6").duration} min until peas tender`);
    push([], `⭐ GAP: ${j("C6").duration} min simmer — stir occasionally`);
    t += j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push([], "SERVE — or refrigerate overnight for best flavour");
    return sched;
  },

  buildPrePrepSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note, phase) => { sched.push({ mins: t, tasks, note, phase }); };

    push(["P1"], j("P1").name, "prep");
    t += j("P1").duration;
    push(["P2"], j("P2").name, "prep");
    t += j("P2").duration;
    push(["P3"], j("P3").name, "prep");
    t += j("P3").duration;
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    push(["P5"], j("P5").name, "prep");
    t += j("P5").duration;
    push(["P6"], j("P6").name, "prep");
    t += j("P6").duration;
    const prepEnd = t;
    push([], "ALL PREP DONE — meat sliced, veg chopped, kale ready, peas rinsed", "prep");

    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], `${j("C3").name} (10 min)`, "cook");
    t += j("C3").duration;
    push(["C4"], `${j("C4").name} (8 min)`, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], `Reduce to simmer; cook uncovered ${j("C6").duration} min until peas tender`, "cook");
    t += j("C6").duration;
    push(["C7"], j("C7").name, "cook");
    t += j("C7").duration;
    push([], "SERVE — or refrigerate overnight for best flavour", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [], P6: [],
      C1: ["P1", "P2", "P3", "P4", "P5", "P6"],
      C2: ["C1", "P1", "P2"],
      C3: ["C2", "P3", "P4"],
      C4: ["C3", "P5"],
      C5: ["C4", "P6"],
      C6: ["C5"],
      C7: ["C6"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [], P6: [],
      C1: ["P1", "P2"],
      C2: ["C1"],
      C3: ["C2", "P3", "P4"],
      C4: ["C3", "P5"],
      C5: ["C4", "P6"],
      C6: ["C5"],
      C7: ["C6"],
    },
  },
};

export default recipe;
