import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "thai-coconut-soup",
  title: "Thai Coconut Soup (Shrimp)",
  source: "AllRecipes",
  cuisine: "Thai",
  image: "https://images.unsplash.com/premium_photo-1669150849060-1d6a6dabad14?w=400&h=300&fit=crop",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [2, 12],
  notes: "Bold Thai flavors with shrimp. Prep: 35 min. Cook: 30 min.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const canCount = si(3);
    return [
      { category: "Seafood", items: [
        { name: "Medium shrimp, peeled & deveined", amount: `${si(1)} lb (${s(454)}g)` },
      ]},
      { category: "Produce", items: [
        { name: "Fresh ginger", amount: `${si(2)} tbsp grated` },
        { name: "Lemongrass stalk", amount: `${si(1)}`, note: "Minced" },
        { name: "Fresh shiitake mushrooms", amount: `${sf(0.5)} lb (${s(227)}g)`, note: "Sliced" },
        { name: "Fresh limes", amount: `${si(2)}`, note: `${si(2)} tbsp juice` },
        { name: "Fresh cilantro", amount: `${sf(0.25)} cup`, note: "Chopped, for garnish" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Coconut milk (13.5oz can)", amount: `${canCount} ${pl(canCount, "can")} (${s(1215)}ml)` },
        { name: "Chicken broth", amount: `${si(4)} cups (${s(960)}ml)` },
        { name: "Fish sauce", amount: `${si(3)} tbsp` },
        { name: "Red curry paste", amount: `${si(2)} tsp` },
      ]},
      { category: "Dry goods", items: [
        { name: "Vegetable oil", amount: `${si(1)} tbsp` },
        { name: "Light brown sugar", amount: `${si(1)} tbsp` },
      ]},
      { category: "Spices", items: [
        { name: "Salt", amount: "To taste" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const canCount = ri(3, mult);

    return [
      { id: "P1", name: `Grate ${si(2)} tbsp fresh ginger`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P2", name: `Mince ${si(1)} stalk lemongrass (tender inner part only)`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Slice ${sf(0.5)} lb (${s(227)}g) shiitake mushrooms`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "P4", name: `Peel & devein ${si(1)} lb (${s(454)}g) shrimp if needed`, duration: prepScale(8, mult), category: "prep", step: 1 },
      { id: "P5", name: `Juice limes: ${si(2)} tbsp lime juice; chop ${sf(0.25)} cup cilantro; measure ${si(3)} tbsp fish sauce, ${si(1)} tbsp brown sugar, ${si(2)} tsp red curry paste`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "C1", name: `Heat ${si(1)} tbsp vegetable oil in large pot over medium heat`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Cook ginger, lemongrass and ${si(2)} tsp red curry paste, stirring, 1 min until fragrant`, duration: 1, category: "cook", step: 1 },
      { id: "C3", name: `Pour in ${si(4)} cups (${s(960)}ml) chicken broth, stirring to combine; bring to simmer`, duration: 4, category: "cook", step: 1 },
      { id: "C4", name: `Add ${si(3)} tbsp fish sauce and ${si(1)} tbsp brown sugar; simmer 15 min`, duration: 15, category: "cook", step: 2 },
      { id: "C5", name: `Add ${canCount} ${pl(canCount, "can")} (${s(1215)}ml) coconut milk and ${sf(0.5)} lb (${s(227)}g) sliced shiitakes; simmer 5 min`, duration: 5, category: "cook", step: 2 },
      { id: "C6", name: `Add ${si(1)} lb (${s(454)}g) shrimp; cook 5 min until pink and opaque`, duration: 5, category: "cook", step: 3 },
      { id: "C7", name: `Stir in ${si(2)} tbsp lime juice; season with salt to taste; garnish with cilantro and serve`, duration: 3, category: "cook", step: 3 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2"], `Prep aromatics: ${j("P1").name}. ${j("P2").name}`);
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
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push([], "SERVE garnished with cilantro");
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
    const prepEnd = t;
    push([], "ALL PREP DONE — delis loaded, ready to cook", "prep");

    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], j("C3").name, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], j("C6").name, "cook");
    t += j("C6").duration;
    push(["C7"], j("C7").name, "cook");
    t += j("C7").duration;
    push([], "SERVE garnished with cilantro", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1", "P2", "P3", "P4", "P5"],
      C2: ["C1", "P1", "P2"], C3: ["C2"],
      C4: ["C3", "P5"], C5: ["C4", "P3"],
      C6: ["C5", "P4"], C7: ["C6", "P5"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1", "P2"],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3", "P5"], C5: ["C4", "P3"],
      C6: ["C5", "P4"], C7: ["C6"],
    },
  },
};

export default recipe;
