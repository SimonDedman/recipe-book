import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chili-mild-bills",
  title: "Mild Bill's Bob Coates Championship Chili",
  source: "Mild Bill's Spices, Bob Coates 1999 Terlingua",
  cuisine: "Chili & Tex-Mex",
  image: "https://images.unsplash.com/photo-1726514733206-0aef2e150718?w=400&h=300&fit=crop",
  baseServings: 5,
  multiplierOptions: [1, 1.5, 2, 3, 4],
  servingsRange: [3, 20],
  notes: "Uses Mild Bill's pre-mixed packet. Simplest chili recipe. Prep: 5 mins. Cook: ~2h.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    return [
      { category: "Meat", items: [
        { name: "80:20 ground chuck beef", amount: `${s(2)} lb (${s(907)}g)` },
      ]},
      { category: "Spice Packet", items: [
        { name: "Mild Bill's Bob Coates Mix", amount: `${si(1)} ${pl(si(1), "pack")}`, note: "Contains dump 1 and dump 2 sub-packets" },
        { name: "Sazon Goya", amount: `${si(1)} ${pl(si(1), "pack")}`, note: "Added with dump 2" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Tomato sauce", amount: `${s(8)} fl oz (${s(237)}ml)` },
        { name: "Beef broth", amount: `${s(15)} fl oz (${s(444)}ml)` },
        { name: "Chicken broth", amount: `${s(15)} fl oz (${s(444)}ml)` },
      ]},
      { category: "Accompaniments", items: [
        { name: "Sour cream", amount: `${s(50)}ml` },
        { name: "Green onions", amount: `${si(5)}` },
        { name: "Grated cheddar or Monterey Jack", amount: `${s(250)}g` },
        { name: "Extra chilies", amount: `${si(5)}` },
        { name: "Bread slices", amount: `${si(15)}` },
        { name: "Butter", amount: `${s(50)}g` },
        { name: "Garlic cloves (for bread)", amount: `${si(5)}` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);

    return [
      { id: "P1", name: `Open Mild Bill's ${pl(si(1), "pack")}: separate dump 1 and dump 2 sub-packets. Open ${si(1)} Sazon Goya ${pl(si(1), "pack")}`, duration: 2, category: "prep", step: 1 },
      { id: "P2", name: `Open & measure ${s(8)} fl oz (${s(237)}ml) tomato sauce, ${s(15)} fl oz (${s(444)}ml) beef broth, ${s(15)} fl oz (${s(444)}ml) chicken broth`, duration: 3, category: "prep", step: 1 },
      { id: "P3", name: `Slice ${si(5)} green onions, portion ${s(50)}ml sour cream, grate ${s(250)}g cheese`, duration: prepScale(8, mult), category: "prep", step: 1, note: "Can do during simmers" },
      { id: "C1", name: `Brown ${s(2)} lb (${s(907)}g) ground chuck beef${mult > 1 ? " in batches" : ""} in dry pot over medium-high; drain grease well`, duration: cookScale(10, mult, "batch"), category: "cook", step: 1, note: "No oil needed — beef has enough fat" },
      { id: "C2", name: `Add ${s(8)} fl oz (${s(237)}ml) tomato sauce + ${s(15)} fl oz (${s(444)}ml) beef broth + ${s(15)} fl oz (${s(444)}ml) chicken broth + dump 1 packet → stir, bring to boil`, duration: 5, category: "cook", step: 2 },
      { id: "C3", name: `Reduce heat, simmer uncovered per packet instructions (approx 45–60 min)`, duration: 50, category: "cook", step: 2, note: "Stir occasionally; follow Mild Bill's packet timing" },
      { id: "C4", name: `Add dump 2 packet + ${si(1)} ${pl(si(1), "pack")} Sazon Goya → stir well`, duration: 2, category: "cook", step: 3 },
      { id: "C5", name: `Simmer uncovered per packet instructions (approx 30 min)`, duration: 30, category: "cook", step: 3, note: "Adjust salt, heat, and liquid to taste" },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2"], `Open spice packets and measure liquids`);
    t += Math.max(j("P1").duration, j("P2").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], `Simmer uncovered ~50 min (follow packet instructions)`);
    push(["P3"], `GAP: ${j("P3").name} during first simmer`);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], `Simmer uncovered ~30 min — adjust salt, heat & liquid`);
    t += j("C5").duration;
    push([], "SERVE with accompaniments");
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
    push([], "ALL PREP DONE — packets, liquids, and accompaniments ready", "prep");

    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], `Simmer uncovered ~50 min (follow packet instructions)`, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], `Simmer uncovered ~30 min — adjust salt, heat & liquid`, "cook");
    t += j("C5").duration;
    push([], "SERVE with accompaniments", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2"], C2: ["C1", "P1", "P2"],
      C3: ["C2"], C4: ["C3", "P1"],
      C5: ["C4"],
    },
    optimized: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2"], C2: ["C1", "P1", "P2"],
      C3: ["C2"], C4: ["C3", "P1"],
      C5: ["C4"],
    },
  },
};

export default recipe;
