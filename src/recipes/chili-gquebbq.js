import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chili-gquebbq",
  title: "GqueBBQ Chili Con Carne",
  source: "GqueBBQ YouTube",
  baseServings: 5,
  multiplierOptions: [1, 1.5, 2, 3, 4],
  servingsRange: [3, 20],
  notes: "Simplified chili with dark+light chili powder blend. Prep: 10 mins. Cook: 1h30 simmer.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "80:20 ground chuck beef", amount: `${s(2)} lb (${s(907)}g)` },
        { name: "Cooking oil", amount: `${si(1)} tbsp` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Tomato sauce", amount: `${s(8)} fl oz (${s(237)}ml)` },
        { name: "Beef broth", amount: `${s(15)} fl oz (${s(444)}ml)` },
      ]},
      { category: "1st Spice Dump", items: [
        { name: "Onion Granules", amount: `${si(1)} tbsp` },
        { name: "Dark+light chili powder combo", amount: `${si(3)} tbsp` },
        { name: "Garlic powder", amount: `${si(1)} tsp` },
        { name: "Salt", amount: `${sf(0.5)} tsp` },
        { name: "Cumin", amount: `${sf(0.5)} tbsp` },
        { name: "Cayenne pepper", amount: `${sf(0.5)} tsp` },
        { name: "Black pepper", amount: `${sf(0.5)} tsp` },
        { name: "Chicken granules", amount: `${si(1)} tsp`, note: "or 1 bouillon cube" },
      ]},
      { category: "2nd Spice Dump", items: [
        { name: "Dark+light chili powder combo", amount: `${si(2)} tbsp` },
        { name: "Cumin", amount: `${sf(0.5)} tbsp` },
        { name: "Paprika", amount: `${si(1)} tsp` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Measure & combine 1st spice dump: ${si(1)} tbsp Onion Granules, ${si(3)} tbsp dark+light chili powder, ${si(1)} tsp Garlic powder, ${sf(0.5)} tsp Salt, ${sf(0.5)} tbsp Cumin, ${sf(0.5)} tsp Cayenne, ${sf(0.5)} tsp Black pepper, ${si(1)} tsp Chicken granules`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "P2", name: `Measure & combine 2nd spice dump: ${si(2)} tbsp dark+light chili powder, ${sf(0.5)} tbsp Cumin, ${si(1)} tsp Paprika`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P3", name: `Open & measure ${s(8)} fl oz (${s(237)}ml) tomato sauce and ${s(15)} fl oz (${s(444)}ml) beef broth`, duration: 2, category: "prep", step: 1 },
      { id: "C1", name: `Heat ${si(1)} tbsp oil in large pot over medium-high`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Lightly brown ${s(2)} lb (${s(907)}g) ground chuck beef${mult > 1 ? " in batches" : ""}`, duration: cookScale(8, mult, "batch"), category: "cook", step: 1, note: mult > 1 ? "Do not cook through fully before adding liquids" : "Lightly brown, no need to fully cook" },
      { id: "C3", name: `Add ${s(8)} fl oz (${s(237)}ml) tomato sauce + ${s(15)} fl oz (${s(444)}ml) beef broth + 1st spice dump → stir well`, duration: 3, category: "cook", step: 2 },
      { id: "C4", name: `Simmer uncovered 30 min`, duration: 30, category: "cook", step: 2, note: "Stir occasionally" },
      { id: "C5", name: `Add 2nd spice dump → stir well`, duration: 2, category: "cook", step: 3 },
      { id: "C6", name: `Simmer uncovered 1 hour`, duration: 60, category: "cook", step: 3, note: "Stir occasionally; skim fat if desired" },
      { id: "C7", name: `Final 30 min simmer uncovered`, duration: 30, category: "cook", step: 4, note: "Adjust consistency — reduce or add liquid as needed" },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2", "P3"], `Measure both spice dumps and liquids`);
    t += Math.max(j("P1").duration, j("P2").duration, j("P3").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], j("C3").name);
    t += j("C3").duration;
    push(["C4"], `Simmer 30 min uncovered`);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], `Simmer 1 hour uncovered`);
    t += j("C6").duration;
    push(["C7"], `Final 30 min simmer — adjust consistency`);
    t += j("C7").duration;
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
    push([], "ALL PREP DONE — spice dumps and liquids ready", "prep");

    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], j("C3").name, "cook");
    t += j("C3").duration;
    push(["C4"], `Simmer 30 min uncovered`, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], `Simmer 1 hour uncovered`, "cook");
    t += j("C6").duration;
    push(["C7"], `Final 30 min simmer — adjust consistency`, "cook");
    t += j("C7").duration;
    push([], "SERVE", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2", "P3"], C2: ["C1"],
      C3: ["C2", "P1", "P3"], C4: ["C3"],
      C5: ["C4", "P2"], C6: ["C5"],
      C7: ["C6"],
    },
    optimized: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2", "P3"], C2: ["C1"],
      C3: ["C2", "P1", "P3"], C4: ["C3"],
      C5: ["C4", "P2"], C6: ["C5"],
      C7: ["C6"],
    },
  },
};

export default recipe;
