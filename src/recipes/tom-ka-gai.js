import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "tom-ka-gai",
  title: "Tom Ka Gai (Coconut Chicken Soup)",
  source: "AllRecipes",
  baseServings: 2,
  multiplierOptions: [1, 2, 3, 4, 5],
  servingsRange: [2, 10],
  notes: "Quick Thai coconut soup. Prep: 15 min. Cook: 20 min. Total: 35 min.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Boneless skinless chicken", amount: `${sf(0.25)} lb (${s(113)}g)`, note: "Sliced into thin strips" },
      ]},
      { category: "Produce", items: [
        { name: "Fresh ginger", amount: `${si(2)} tsp minced` },
        { name: "Green onion (scallion)", amount: `${si(2)} tsp sliced` },
        { name: "Fresh cilantro", amount: `${si(1)} tsp chopped` },
        { name: "Fresh limes", amount: `${si(1)}`, note: `${si(4)} tsp (${sf(1.33)} tbsp) juice` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Coconut milk (14oz can)", amount: `${sf(0.625)} ${pl(si(1), "can")} (${s(221)}g)`, note: "~⅝ of a can per ×1 serving" },
        { name: "Fish sauce", amount: `${si(4)} tsp (${sf(1.33)} tbsp)` },
      ]},
      { category: "Dry goods", items: [
        { name: "Vegetable oil", amount: `${si(1)} tbsp` },
        { name: "Water", amount: `${sf(0.67)} cup (${s(158)}ml)` },
      ]},
      { category: "Spices", items: [
        { name: "Cayenne pepper", amount: `${sf(0.125)} tsp` },
        { name: "Ground turmeric", amount: `${sf(0.125)} tsp` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Slice ${sf(0.25)} lb (${s(113)}g) chicken into thin strips`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P2", name: `Mince ${si(2)} tsp fresh ginger`, duration: prepScale(2, mult), category: "prep", step: 1 },
      { id: "P3", name: `Slice ${si(2)} tsp green onion; chop ${si(1)} tsp cilantro`, duration: prepScale(2, mult), category: "prep", step: 1 },
      { id: "P4", name: `Juice limes: ${si(4)} tsp (${sf(1.33)} tbsp) lime juice; measure ${si(4)} tsp fish sauce`, duration: 3, category: "prep", step: 1 },
      { id: "P5", name: `Measure ${sf(0.125)} tsp cayenne, ${sf(0.125)} tsp turmeric`, duration: 2, category: "prep", step: 1 },
      { id: "C1", name: `Heat ${si(1)} tbsp vegetable oil in pan or wok over medium-high heat`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Sauté chicken strips 2-3 min until white throughout`, duration: cookScale(3, mult, mult > 2 ? "batch" : "fixed"), category: "cook", step: 1, note: mult > 2 ? "Cook in batches" : "" },
      { id: "C3", name: `Combine coconut milk (${sf(0.625)} ${pl(si(1), "can")}, ${s(221)}g) and ${sf(0.67)} cup (${s(158)}ml) water in pot; bring to boil`, duration: 5, category: "cook", step: 2 },
      { id: "C4", name: `Reduce heat; add ginger, ${si(4)} tsp fish sauce, ${si(4)} tsp lime juice, ${sf(0.125)} tsp cayenne, ${sf(0.125)} tsp turmeric and chicken; stir to combine`, duration: 3, category: "cook", step: 2 },
      { id: "C5", name: `Simmer 10-15 min until flavors meld`, duration: 12, category: "cook", step: 2 },
      { id: "C6", name: `Sprinkle with green onion and cilantro; serve immediately`, duration: 2, category: "cook", step: 3 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2", "P3", "P4", "P5"], `Prep all: ${j("P1").name}. ${j("P2").name}. ${j("P3").name}. Juice limes, measure fish sauce & spices`);
    t += Math.max(j("P1").duration, j("P2").duration, j("P3").duration, j("P4").duration, j("P5").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    push(["C3"], `⭐ PARALLEL — ${j("C3").name}`);
    t += Math.max(j("C2").duration, j("C3").duration);
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push([], "SERVE immediately");
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
    push([], "ALL PREP DONE — ready to cook", "prep");

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
    push([], "SERVE immediately", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1", "P2", "P3", "P4", "P5"],
      C2: ["C1", "P1"], C3: ["P4", "P5"],
      C4: ["C2", "C3", "P2"], C5: ["C4"],
      C6: ["C5", "P3"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1"],
      C2: ["C1"], C3: ["P4", "P5"],
      C4: ["C2", "C3", "P2"], C5: ["C4"],
      C6: ["C5", "P3"],
    },
  },
};

export default recipe;
