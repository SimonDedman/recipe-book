import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chili-margaret",
  title: "Margaret Nadeau CASI Championship Chili",
  source: "Margaret Nadeau, CASI Chili Winner",
  cuisine: "Chili & Tex-Mex",
  image: "https://images.unsplash.com/photo-1666819632298-fe15dc7d4c34?w=400&h=300&fit=crop",
  baseServings: 5,
  multiplierOptions: [1, 1.5, 2, 3, 4],
  servingsRange: [3, 20],
  notes: "Championship-style Texas chili. Uses Mild Bill's specialty spices. Prep: 10 mins. Cook: 80 mins.",

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
        { name: "Beef broth", amount: `${s(15)} fl oz (${s(444)}ml)` },
        { name: "Tomato sauce", amount: `${s(8)} fl oz (${s(237)}ml)` },
        { name: "Louisiana Hot Sauce", amount: "2 dashes per batch", note: "For 2nd dump" },
        { name: "Sazon Goya packets", amount: `${si(1)} ${pl(si(1), "pack")}`, note: "For 2nd dump" },
      ]},
      { category: "1st Spice Dump", items: [
        { name: "Mexene Chili Powder", amount: `${si(1)} tbsp` },
        { name: "San Antonio Original", amount: `${si(1)} tbsp` },
        { name: "Dixon Med Hot", amount: `${sf(0.25)} tbsp` },
        { name: "Onion Granules", amount: `${si(1)} tbsp` },
        { name: "Garlic Granules", amount: `${si(1)} tbsp` },
        { name: "Beef Granules", amount: `${si(1)} tbsp` },
        { name: "Chicken Granules", amount: `${si(1)} tbsp` },
        { name: "Cumin", amount: `${si(2)} tsp` },
        { name: "Hungarian Paprika", amount: `${sf(0.25)} tsp` },
        { name: "Salt", amount: `${sf(0.125)} tsp` },
        { name: "Hot Stuff", amount: `${sf(0.5)} tsp` },
      ]},
      { category: "2nd Spice Dump", items: [
        { name: "Mexene Chili Powder", amount: `${si(1)} tsp` },
        { name: "San Antonio Original", amount: `${si(1)} tbsp` },
        { name: "Cowtown Lite", amount: `${si(1)} tsp` },
        { name: "San Antonio Red", amount: `${si(1)} tsp` },
        { name: "Cumin", amount: `${si(1)} tsp` },
        { name: "Louisiana Hot Sauce", amount: "2 dashes" },
        { name: "Hot Stuff", amount: `${sf(0.125)} tsp` },
        { name: "Sazon Goya", amount: `${si(1)} ${pl(si(1), "pack")}` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Measure & combine 1st spice dump: ${si(1)} tbsp Mexene, ${si(1)} tbsp San Antonio Original, ${sf(0.25)} tbsp Dixon Med Hot, ${si(1)} tbsp Onion Granules, ${si(1)} tbsp Garlic Granules, ${si(1)} tbsp Beef Granules, ${si(1)} tbsp Chicken Granules, ${si(2)} tsp Cumin, ${sf(0.25)} tsp Paprika, ${sf(0.125)} tsp Salt, ${sf(0.5)} tsp Hot Stuff`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "P2", name: `Measure & combine 2nd spice dump: ${si(1)} tsp Mexene, ${si(1)} tbsp San Antonio Original, ${si(1)} tsp Cowtown Lite, ${si(1)} tsp San Antonio Red, ${si(1)} tsp Cumin, 2 dashes Hot Sauce, ${sf(0.125)} tsp Hot Stuff, ${si(1)} ${pl(si(1), "pack")} Sazon Goya`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Open & measure ${s(15)} fl oz (${s(444)}ml) beef broth and ${s(8)} fl oz (${s(237)}ml) tomato sauce`, duration: 2, category: "prep", step: 1 },
      { id: "C1", name: `Heat ${si(1)} tbsp oil in large pot over medium-high`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Brown ${s(2)} lb (${s(907)}g) ground chuck beef${mult > 1 ? " in batches" : ""}; drain grease`, duration: cookScale(10, mult, "batch"), category: "cook", step: 1, note: mult > 1 ? "Drain well between batches" : "Drain grease thoroughly" },
      { id: "C3", name: `Add ${s(15)} fl oz (${s(444)}ml) beef broth + ${s(8)} fl oz (${s(237)}ml) tomato sauce + 1st spice dump → bring to boil`, duration: 5, category: "cook", step: 2 },
      { id: "C4", name: `Reduce heat, simmer uncovered 50 min`, duration: 50, category: "cook", step: 2, note: "Stir occasionally; adjust liquid if needed" },
      { id: "C5", name: `Add 2nd spice dump → stir well`, duration: 2, category: "cook", step: 3 },
      { id: "C6", name: `Simmer uncovered 30 min`, duration: 30, category: "cook", step: 3, note: "Adjust salt, heat, and liquid to taste" },
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
    push(["C4"], `Simmer 50 min uncovered`);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], `Simmer 30 min uncovered — adjust salt, heat & liquid`);
    t += j("C6").duration;
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
    push(["C4"], `Simmer 50 min uncovered`, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], `Simmer 30 min uncovered — adjust salt, heat & liquid`, "cook");
    t += j("C6").duration;
    push([], "SERVE", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2", "P3"], C2: ["C1"],
      C3: ["C2", "P1", "P3"], C4: ["C3"],
      C5: ["C4", "P2"], C6: ["C5"],
    },
    optimized: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2", "P3"], C2: ["C1"],
      C3: ["C2", "P1", "P3"], C4: ["C3"],
      C5: ["C4", "P2"], C6: ["C5"],
    },
  },
};

export default recipe;
