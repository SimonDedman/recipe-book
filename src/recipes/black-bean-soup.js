import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "black-bean-soup",
  title: "Black Bean Soup with Chorizo & Braised Chicken",
  source: "Serious Eats",
  cuisine: "Latin American",
  image: "https://images.unsplash.com/photo-1593179241557-bce1eb92e47e?w=400&h=300&fit=crop",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [3, 12],
  notes: "Active: 45 min. Total: 2h (+ overnight bean soak). Can use canned beans (2×28oz, reduce broth).",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const canBeans = si(2);
    return [
      { category: "Meat", items: [
        { name: "Chicken drumsticks or thighs (bone-in)", amount: `${s(2)} lb (${s(900)}g)` },
        { name: "Smoked chorizo", amount: `${si(6)} oz (${s(170)}g), ¼-inch slices` },
      ]},
      { category: "Produce", items: [
        { name: "Scallions", amount: `${si(8)}`, note: "Whites and greens separated" },
        { name: "Serrano peppers", amount: `${si(2)}`, note: "1 chopped for soup, 1 sliced for garnish" },
        { name: "Garlic cloves", amount: `${si(4)}, minced` },
        { name: "Avocado", amount: `${si(1)}`, note: "For garnish" },
        { name: "Limes", amount: `${si(1)}`, note: "Juice for garnish" },
        { name: "Fresh cilantro", amount: "Small bunch", note: "For garnish" },
      ]},
      { category: "Beans", items: [
        { name: "Dried black beans", amount: `${s(1)} lb (${s(450)}g)`, note: `Or ${canBeans} × 28oz ${pl(canBeans, "can")}, drained — reduce broth by ~${si(1)} cup` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Chicken broth", amount: `${sf(1.5)} quarts (${s(1440)}ml)` },
        { name: "Chipotles in adobo", amount: `${si(2)} chipotles, minced + ${si(1)} tbsp adobo sauce` },
      ]},
      { category: "Spices", items: [
        { name: "Ground cumin", amount: `${si(2)} tsp` },
        { name: "Bay leaves", amount: `${si(2)}` },
        { name: "Salt & pepper", amount: "To taste" },
      ]},
      { category: "Oil", items: [
        { name: "Canola or vegetable oil", amount: `${si(1)} tbsp (${s(15)}ml)` },
      ]},
      { category: "Garnish", items: [
        { name: "Sour cream or crema", amount: "To serve" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Soak ${s(1)} lb (${s(450)}g) dried black beans overnight in salted water`, duration: 2, category: "prep", step: 1, note: "Night before; or use 2×28oz canned beans" },
      { id: "P2", name: `Season ${s(2)} lb (${s(900)}g) chicken ${pl(si(4), "piece")} with salt and pepper`, duration: prepScale(2, mult), category: "prep", step: 2 },
      { id: "P3", name: `Separate scallion whites from greens; chop ${si(1)} Serrano, slice ${si(1)} Serrano (garnish); mince ${si(4)} garlic cloves; mince ${si(2)} chipotles + measure ${si(1)} tbsp adobo sauce`, duration: prepScale(6, mult), category: "prep", step: 2 },
      { id: "P4", name: `Drain soaked beans (or open and drain ${si(2)} × 28oz cans)`, duration: 2, category: "prep", step: 3 },
      { id: "C1", name: `Heat ${si(1)} tbsp (${s(15)}ml) oil in large pot or Dutch oven over medium-high`, duration: 2, category: "cook", step: 2 },
      { id: "C2", name: `Brown chicken skin-side down 5 min, flip, brown 3 min more; remove to plate`, duration: cookScale(8, mult, mult > 1.5 ? "batch" : "fixed"), category: "cook", step: 2, note: mult > 1.5 ? "Brown in batches; do not crowd" : "Do not crowd" },
      { id: "C3", name: `Brown ${si(6)} oz (${s(170)}g) chorizo slices in same pot 4 min; remove`, duration: cookScale(4, mult, "fixed"), category: "cook", step: 3 },
      { id: "C4", name: `Add scallion whites, ${si(1)} chopped Serrano, ${si(4)} minced garlic to pot; cook 2 min`, duration: 3, category: "cook", step: 3 },
      { id: "C5", name: `Add ${si(2)} tsp cumin; cook 30 sec until fragrant`, duration: 1, category: "cook", step: 3 },
      { id: "C6", name: `Add ${si(2)} minced chipotles + ${si(1)} tbsp adobo sauce; cook 1 min`, duration: 2, category: "cook", step: 3 },
      { id: "C7", name: `Add ${sf(1.5)} quarts (${s(1440)}ml) broth and ${si(2)} bay leaves; bring to simmer`, duration: 5, category: "cook", step: 3 },
      { id: "C8", name: `Add drained beans, browned chicken, and chorizo; return to simmer`, duration: 3, category: "cook", step: 4 },
      { id: "C9", name: `Simmer 45 min-1h until beans are tender and chicken is cooked through`, duration: mult > 1.5 ? 60 : 50, category: "cook", step: 4, note: "Beans should be fully tender" },
      { id: "C10", name: `Remove bay leaves; pull out chicken, discard skin and bones, shred meat; return to pot`, duration: prepScale(7, mult), category: "cook", step: 5 },
      { id: "C11", name: `Blend or mash 2 cups beans from pot; stir back in to thicken`, duration: 5, category: "cook", step: 5 },
      { id: "P5", name: `Prep garnishes: dice avocado, slice reserved Serrano, halve lime, pick cilantro`, duration: prepScale(5, mult), category: "prep", step: 5 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1"], `NIGHT BEFORE: ${j("P1").name}`);
    push([], "── Day of ──");
    push(["P2", "P3"], `${j("P2").name}. ${j("P3").name}`);
    t += Math.max(j("P2").duration, j("P3").duration);
    push(["P4"], j("P4").name);
    t += j("P4").duration;
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
    push(["C8"], j("C8").name);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    push(["P5"], `⭐ GAP: ${j("P5").name} — while soup simmers`);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
    push(["C11"], j("C11").name);
    t += j("C11").duration;
    push([], "SERVE with avocado, sliced Serrano, cilantro, sour cream/crema, lime");
    return sched;
  },

  buildPrePrepSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note, phase) => { sched.push({ mins: t, tasks, note, phase }); };

    push(["P1"], `${j("P1").name} (night before)`, "prep");
    push([], "── Day of prep ──", "prep");
    push(["P2"], j("P2").name, "prep");
    t += j("P2").duration;
    push(["P3"], j("P3").name, "prep");
    t += j("P3").duration;
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    const prepEnd = t;
    push([], "ALL PRE-PREP DONE — chicken seasoned, aromatics chopped, beans drained", "prep");

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
    push(["P5"], j("P5").name, "cook");
    t += j("P5").duration;
    push(["C10"], j("C10").name, "cook");
    t += j("C10").duration;
    push(["C11"], j("C11").name, "cook");
    t += j("C11").duration;
    push([], "SERVE with avocado, sliced Serrano, cilantro, sour cream/crema, lime", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: ["P1"], P5: [],
      C1: ["P2", "P3", "P4"], C2: ["C1", "P2"],
      C3: ["C2"], C4: ["C3", "P3"], C5: ["C4"],
      C6: ["C5", "P3"], C7: ["C6"],
      C8: ["C7", "P4", "C2", "C3"],
      C9: ["C8"], C10: ["C9"], C11: ["C10"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: ["P1"], P5: ["C8"],
      C1: ["P2", "P3", "P4"], C2: ["C1", "P2"],
      C3: ["C2"], C4: ["C3", "P3"], C5: ["C4"],
      C6: ["C5", "P3"], C7: ["C6"],
      C8: ["C7", "P4", "C2", "C3"],
      C9: ["C8"], C10: ["C9"], C11: ["C10"],
    },
  },
};

export default recipe;
