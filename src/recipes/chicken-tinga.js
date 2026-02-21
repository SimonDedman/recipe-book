import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chicken-tinga",
  title: "Easy One-Pot Chicken Tinga",
  source: "Serious Eats",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [2, 12],
  notes: "Spicy Mexican shredded chicken. Active: 35 min. Total: 1h10. Versatile: tacos, burritos, nachos.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const chipotles = si(2) + (mult > 1 ? 1 : 0);
    return [
      { category: "Meat", items: [
        { name: "Bone-in, skin-on chicken breast halves", amount: `${si(2)} halves (~${s(1.25)} lb / ${s(550)}g)` },
      ]},
      { category: "Produce", items: [
        { name: "Tomatillos (2 medium / 6 oz), peeled", amount: `${s(6)} oz (${si(2)} medium)` },
        { name: "Plum tomatoes (2 medium / 6 oz)", amount: `${s(6)} oz (${si(2)} medium)` },
        { name: "Garlic cloves", amount: `${si(4)}` },
        { name: "Small white onion, chopped", amount: `${si(1)}` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Chipotles in adobo + sauce", amount: `${si(2)}-${si(3)} chipotles + ${si(1)} tbsp sauce`, note: "From one can; freeze remainder" },
        { name: "Chicken stock", amount: `${si(2)} cups (${s(475)}ml)` },
      ]},
      { category: "Pantry", items: [
        { name: "Lard or vegetable oil", amount: `${si(2)} tbsp` },
        { name: "Dried oregano (Mexican preferred)", amount: `${si(2)} tsp` },
        { name: "Cider vinegar", amount: `${si(2)} tbsp` },
        { name: "Fish sauce", amount: `${si(2)} tsp` },
        { name: "Bay leaves", amount: `${si(2)}` },
        { name: "Salt & pepper", amount: "To taste" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Season ${si(2)} chicken breast halves generously with salt and pepper`, duration: 2, category: "prep", step: 1 },
      { id: "P2", name: `Peel ${s(6)} oz tomatillos; roughly chop ${s(6)} oz plum tomatoes; peel ${si(4)} garlic cloves; chop ${si(1)} small white onion`, duration: prepScale(6, mult), category: "prep", step: 1 },
      { id: "P3", name: `Measure: ${si(2)} tbsp lard/oil, ${si(2)} tsp oregano, ${si(2)} bay leaves, ${si(2)} tbsp cider vinegar, ${si(2)} cups stock, ${si(2)} tsp fish sauce`, duration: 3, category: "prep", step: 1 },
      { id: "C1", name: `Heat ${si(2)} tbsp lard/oil in Dutch oven over medium-high; sear chicken skin-down 6-8 min until golden, flip 2 min`, duration: cookScale(10, mult, "batch"), category: "cook", step: 2, note: mult > 1.5 ? "May need batches" : "Single batch" },
      { id: "C2", name: `Remove chicken; add tomatillos, tomatoes, garlic to same pan; blister 5 min`, duration: 5, category: "cook", step: 3 },
      { id: "C3", name: `Add chopped onion; cook 2 min`, duration: 2, category: "cook", step: 3 },
      { id: "C4", name: `Add ${si(2)} tsp oregano + ${si(2)} bay leaves; cook 30 sec until fragrant`, duration: 1, category: "cook", step: 3 },
      { id: "C5", name: `Add ${si(2)} tbsp cider vinegar + ${si(2)} cups (${s(475)}ml) stock; return chicken; bring to simmer`, duration: 3, category: "cook", step: 3 },
      { id: "C6", name: `Simmer covered 20-30 min until chicken reaches 145°F (63°C)`, duration: mult > 2 ? 35 : 25, category: "cook", step: 3, note: "Check temp at 20 min" },
      { id: "C7", name: `Remove chicken; reduce sauce uncovered 5 min`, duration: 5, category: "cook", step: 4 },
      { id: "C8", name: `Add ${si(2)}-${si(3)} chipotles in adobo + ${si(1)} tbsp sauce; blend sauce smooth`, duration: prepScale(4, mult), category: "cook", step: 4 },
      { id: "C9", name: `Shred chicken, discarding skin and bones; return to blended sauce`, duration: prepScale(8, mult), category: "cook", step: 4 },
      { id: "C10", name: `Add ${si(2)} tsp fish sauce; simmer uncovered until sauce thickly coats chicken`, duration: 8, category: "cook", step: 5, note: "5-10 min depending on desired consistency" },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2"], `${j("P1").name}. ${j("P2").name}`);
    t += Math.max(j("P1").duration, j("P2").duration);
    push(["P3"], j("P3").name);
    t += j("P3").duration;
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
    push(["C6"], `Simmer covered — check temp at 20 min`);
    t += j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push(["C8"], j("C8").name);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
    push([], "SERVE — in tacos, burritos, or nachos");
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
    push([], "ALL PREP DONE — chicken seasoned, veg chopped, everything measured", "prep");

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
    push(["C6"], `Simmer covered — check temp at 20 min`, "cook");
    t += j("C6").duration;
    push(["C7"], j("C7").name, "cook");
    t += j("C7").duration;
    push(["C8"], j("C8").name, "cook");
    t += j("C8").duration;
    push(["C9"], j("C9").name, "cook");
    t += j("C9").duration;
    push(["C10"], j("C10").name, "cook");
    t += j("C10").duration;
    push([], "SERVE — in tacos, burritos, or nachos", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [],
      C1: ["P1"],
      C2: ["C1", "P2"], C3: ["C2"], C4: ["C3"],
      C5: ["C4", "P3"], C6: ["C5"],
      C7: ["C6"], C8: ["C7"],
      C9: ["C8"], C10: ["C9"],
    },
    optimized: {
      P1: [], P2: [], P3: [],
      C1: ["P1"],
      C2: ["C1", "P2"], C3: ["C2"], C4: ["C3"],
      C5: ["C4", "P3"], C6: ["C5"],
      C7: ["C6"], C8: ["C7"],
      C9: ["C8"], C10: ["C9"],
    },
  },
};

export default recipe;
