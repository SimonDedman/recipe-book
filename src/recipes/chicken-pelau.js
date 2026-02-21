import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chicken-pelau",
  title: "Chicken Pelau (Trinidad)",
  source: "Uncle Clyde, Paramin, Trinidad & Tobago",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [3, 12],
  notes: "Trinidadian one-pot rice & chicken. Informal recipe, best-effort measurements.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Chicken wings & thighs (skin-on)", amount: `~${si(10)} pieces`, note: "Mix of wings and thighs" },
      ]},
      { category: "Produce", items: [
        { name: "Scotch bonnet or habanero pepper", amount: `${si(1)}`, note: "Chopped; use gloves" },
        { name: "Tomato", amount: `${si(1)}`, note: "Chopped" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Coconut milk", amount: `${si(1)} cup (${s(240)}ml)` },
        { name: "Pigeon peas (canned or cooked)", amount: `~${sf(2)} cups (${s(330)}g)` },
        { name: "Roucou / annatto liquid", amount: `${si(2)} tbsp`, note: "For golden colour; sub annatto powder dissolved in water" },
      ]},
      { category: "Dry goods", items: [
        { name: "Long-grain or parboiled rice", amount: `~${sf(1.5)} cups (${s(278)}g)`, note: "Washed until water runs clear" },
        { name: "Vegetable oil", amount: `~${s(50)}ml` },
        { name: "Water", amount: `~${sf(0.75)} cup (${s(180)}ml)` },
      ]},
      { category: "Spices/Pantry", items: [
        { name: "Brown sugar", amount: `${si(2)} tbsp` },
        { name: "Salt", amount: "To taste" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Wash ~${sf(1.5)} cups (${s(278)}g) rice under cold water until clear; drain`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P2", name: `Chop ${si(1)} scotch bonnet/habanero (wear gloves); chop ${si(1)} tomato`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P3", name: `Measure ${si(2)} tbsp brown sugar, ${si(2)} tbsp roucou liquid, ${si(1)} cup (${s(240)}ml) coconut milk, ~${sf(0.75)} cup (${s(180)}ml) water`, duration: 3, category: "prep", step: 1 },
      { id: "C1", name: `Heat ~${s(50)}ml oil in heavy-bottomed pot or Dutch oven over high heat`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Add ${si(2)} tbsp brown sugar to hot oil; stir 1 min until melted and bubbling (caramel stage — do not burn)`, duration: 2, category: "cook", step: 1 },
      { id: "C3", name: `Add ~${si(10)} chicken pieces; toss quickly to coat in caramel`, duration: 2, category: "cook", step: 1 },
      { id: "C4", name: `Add ${si(2)} tbsp roucou liquid; stir to coat chicken; cook 5 min, turning pieces to colour evenly`, duration: 5, category: "cook", step: 2 },
      { id: "C5", name: `Add ${si(1)} cup (${s(240)}ml) coconut milk; stir to combine`, duration: 2, category: "cook", step: 2 },
      { id: "C6", name: `Add chopped scotch bonnet and chopped tomato; stir`, duration: 1, category: "cook", step: 2 },
      { id: "C7", name: `Add washed rice (~${sf(1.5)} cups); stir to coat in liquid`, duration: 2, category: "cook", step: 3 },
      { id: "C8", name: `Add ~${sf(2)} cups pigeon peas and ~${sf(0.75)} cup (${s(180)}ml) water; stir; bring to boil`, duration: 4, category: "cook", step: 3 },
      { id: "C9", name: `Reduce to lowest heat; cover tightly; cook ${mult > 1.5 ? 30 : 25} min until rice is done and liquid absorbed`, duration: mult > 1.5 ? 30 : 25, category: "cook", step: 3, note: "Do not lift lid during cooking" },
      { id: "C10", name: `Taste and season with salt; fluff gently and serve`, duration: 3, category: "cook", step: 4 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2", "P3"], `Prep: ${j("P1").name}. ${j("P2").name}. Measure liquids & sugar`);
    t += Math.max(j("P1").duration, j("P2").duration, j("P3").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], j("C3").name);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5", "C6"], `${j("C5").name}. ${j("C6").name}`);
    t += j("C5").duration + j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push(["C8"], j("C8").name);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
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
    push(["C7"], j("C7").name, "cook");
    t += j("C7").duration;
    push(["C8"], j("C8").name, "cook");
    t += j("C8").duration;
    push(["C9"], j("C9").name, "cook");
    t += j("C9").duration;
    push(["C10"], j("C10").name, "cook");
    t += j("C10").duration;
    push([], "SERVE", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2", "P3"],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3"], C5: ["C4"],
      C6: ["C5", "P2"], C7: ["C6", "P1"],
      C8: ["C7"], C9: ["C8"],
      C10: ["C9"],
    },
    optimized: {
      P1: [], P2: [], P3: [],
      C1: [],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3"], C5: ["C4", "P3"],
      C6: ["C5", "P2"], C7: ["C6", "P1"],
      C8: ["C7"], C9: ["C8"],
      C10: ["C9"],
    },
  },
};

export default recipe;
