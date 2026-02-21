import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "slow-cooker-carnitas",
  title: "Slow Cooker Pork Carnitas",
  source: "Damn Delicious",
  cuisine: "Mexican",
  image: "https://images.unsplash.com/photo-1768204044545-475dec28ec05?w=400&h=300&fit=crop",
  baseServings: 8,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [4, 24],
  notes: "Set-and-forget slow cooker. Prep: 10 min. Cook: 8h low or 4-5h high + broil.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Pork shoulder, excess fat trimmed", amount: `${s(4)} lb` },
      ]},
      { category: "Produce", items: [
        { name: "Garlic cloves, peeled", amount: `${si(4)}` },
        { name: "Onions, quartered", amount: `${si(2)}` },
        { name: "Oranges (for juice)", amount: `${si(2)}` },
        { name: "Limes (for juice)", amount: `${si(2)}` },
      ]},
      { category: "Spices", items: [
        { name: "Chili powder", amount: `${si(1)} tbsp` },
        { name: "Ground cumin", amount: `${si(2)} tsp` },
        { name: "Dried oregano", amount: `${si(2)} tsp` },
        { name: "Salt", amount: `${si(2)} tsp` },
        { name: "Black pepper", amount: `${si(1)} tsp` },
        { name: "Cloves (optional)", amount: "A few", note: "Optional, adds depth" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Combine spices: ${si(1)} tbsp chili powder, ${si(2)} tsp cumin, ${si(2)} tsp oregano, ${si(2)} tsp salt, ${si(1)} tsp black pepper`, duration: 2, category: "prep", step: 1 },
      { id: "P2", name: `Rub spice mixture all over ${s(4)} lb pork shoulder`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P3", name: `Peel ${si(4)} garlic cloves; quarter ${si(2)} onions; juice ${si(2)} oranges and ${si(2)} limes`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "C1", name: `Place garlic, onions, citrus juice, and rubbed pork in slow cooker; cook LOW 8h or HIGH 4-5h`, duration: 480, category: "cook", step: 2, note: "Do not lift lid" },
      { id: "C2", name: `Remove pork; shred on board with two forks`, duration: prepScale(8, mult), category: "cook", step: 3 },
      { id: "C3", name: `Return shredded pork to slow cooker juices; rest 30 min`, duration: 30, category: "cook", step: 3, note: "Absorbs juices" },
      { id: "C4", name: `Spread pork on sheet pan; broil 3-4 min until edges crisp`, duration: mult > 2 ? 8 : 5, category: "cook", step: 4, note: mult > 2 ? "Work in batches" : "Watch closely" },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1"], j("P1").name);
    t += j("P1").duration;
    push(["P2"], j("P2").name);
    t += j("P2").duration;
    push(["P3"], j("P3").name);
    t += j("P3").duration;
    push(["C1"], `Load slow cooker — LOW 8h or HIGH 4-5h`);
    push([], `⭐ GAP: ${j("C1").duration} min unattended — set-and-forget`);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], `Return pork to juices; rest 30 min`);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push([], "SERVE");
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
    const prepEnd = t;
    push([], "ALL PREP DONE — slow cooker ready to load", "prep");

    push(["C1"], `Load slow cooker — LOW 8h or HIGH 4-5h`, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], `Return pork to juices; rest 30 min`, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push([], "SERVE", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: ["P1"], P3: [],
      C1: ["P2", "P3"],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3"],
    },
    optimized: {
      P1: [], P2: ["P1"], P3: [],
      C1: ["P2", "P3"],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3"],
    },
  },
};

export default recipe;
