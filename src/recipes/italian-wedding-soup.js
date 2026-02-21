import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "italian-wedding-soup",
  title: "Italian Wedding Soup",
  source: "Classic Italian-American",
  baseServings: 6,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [4, 18],
  notes: "Two-component: meatballs + soup. Prep: 30 min. Cook: ~25 min.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const meatballCount = si(24);
    const canBeans = si(1);
    return [
      { category: "Meat", items: [
        { name: "Ground meatball mix (beef, pork, veal)", amount: `${sf(0.75)} lb (${s(340)}g)` },
      ]},
      { category: "Produce", items: [
        { name: "Yellow onion, diced", amount: `${si(1)} cup (${s(160)}g)` },
        { name: "Carrot, diced", amount: `${si(1)} cup (${s(130)}g)` },
        { name: "Garlic cloves", amount: `${si(4)}` },
        { name: "Swiss chard", amount: `${sf(0.5)} lb (${s(225)}g)`, note: "Stems removed, leaves torn" },
        { name: "Fresh flat-leaf parsley", amount: `${si(2)} tbsp, chopped` },
        { name: "Fresh oregano", amount: `${si(2)} tbsp` },
      ]},
      { category: "Dairy/Eggs", items: [
        { name: "Large eggs (for meatballs)", amount: `${si(1)}` },
        { name: "Large eggs (for soup finish)", amount: `${si(2)}` },
        { name: "Parmesan, grated", amount: `${sf(0.33)} cup (${s(30)}g) meatballs + extra for garnish` },
      ]},
      { category: "Pantry", items: [
        { name: "Dried breadcrumbs", amount: `${sf(0.33)} cup (${s(35)}g)` },
        { name: "Whole milk (for breadcrumbs)", amount: `${sf(0.25)} cup (${s(60)}ml)` },
        { name: "Olive oil", amount: `${si(1)} tbsp (${s(15)}ml)` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Chicken broth", amount: `${si(7)} cups (${s(1680)}ml)` },
        { name: "Cannellini beans (15oz can)", amount: `${canBeans} ${pl(canBeans, "can")}`, note: "Drained and rinsed" },
      ]},
      { category: "Dry goods", items: [
        { name: "Dried ditalini pasta", amount: `${sf(0.75)} cup (${s(135)}g)` },
      ]},
      { category: "Spices", items: [
        { name: "Salt", amount: `${si(1)} tsp + to taste` },
        { name: "Black pepper", amount: `${sf(0.25)} tsp + to taste` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const meatballCount = si(24);

    return [
      { id: "P1", name: `Soak ${sf(0.33)} cup (${s(35)}g) breadcrumbs in ${sf(0.25)} cup (${s(60)}ml) milk; let stand 2 min`, duration: 3, category: "prep", step: 1 },
      { id: "P2", name: `Mix ${sf(0.75)} lb (${s(340)}g) ground meat, soaked breadcrumbs, ${sf(0.33)} cup Parmesan, ${si(2)} tbsp parsley, ${si(1)} egg, ${sf(0.5)} tsp salt, ${sf(0.25)} tsp pepper`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Shape into ${meatballCount} walnut-size meatballs`, duration: prepScale(8, mult), category: "prep", step: 1, note: `~${s(14)}g each` },
      { id: "P4", name: `Dice ${si(1)} cup (${s(160)}g) onion, ${si(1)} cup (${s(130)}g) carrot; mince ${si(4)} garlic ${pl(si(4), "clove")}`, duration: prepScale(5, mult), category: "prep", step: 2 },
      { id: "P5", name: `Tear ${sf(0.5)} lb (${s(225)}g) Swiss chard leaves; measure ${si(7)} cups (${s(1680)}ml) broth; drain ${si(1)} ${pl(si(1), "can")} cannellini beans`, duration: prepScale(4, mult), category: "prep", step: 2 },
      { id: "C1", name: `Heat ${si(1)} tbsp (${s(15)}ml) olive oil in large pot over medium-high`, duration: 2, category: "cook", step: 2 },
      { id: "C2", name: `Brown ${meatballCount} meatballs${mult > 1 ? " in batches" : ""} 6-8 min, turning; remove to plate`, duration: cookScale(7, mult, "batch"), category: "cook", step: 2, note: mult > 1 ? "Batches needed; do not crowd" : "Do not crowd pan" },
      { id: "C3", name: `Cook diced onion, carrot, garlic in pot drippings 2 min covered`, duration: 4, category: "cook", step: 3 },
      { id: "C4", name: `Add ${si(7)} cups (${s(1680)}ml) broth; bring to boil`, duration: 6, category: "cook", step: 3 },
      { id: "C5", name: `Add meatballs, cannellini beans, ${sf(0.75)} cup (${s(135)}g) ditalini, chard, ${si(2)} tbsp oregano; simmer 10 min`, duration: 10, category: "cook", step: 4, note: "Pasta should be just tender" },
      { id: "C6", name: `Whisk ${si(2)} eggs with a ladle of hot broth; stir into pot off heat`, duration: 3, category: "cook", step: 5, note: "The egg ribbons set from residual heat" },
      { id: "C7", name: `Cover and let stand 2 min until egg is set; season with salt and pepper`, duration: 3, category: "cook", step: 5 },
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
    push(["P4", "P5"], `⭐ GAP: ${j("P4").name}. ${j("P5").name} — while shaping meatballs`);
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
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push([], "SERVE with grated Parmesan");
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
    push([], "ALL PREP DONE — meatballs shaped, vegetables diced, broth measured", "prep");

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
    push([], "SERVE with grated Parmesan", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: ["P1"], P3: ["P2"],
      P4: [], P5: [],
      C1: ["P3", "P4", "P5"], C2: ["C1", "P3"],
      C3: ["C2", "P4"], C4: ["C3"],
      C5: ["C4", "C2", "P5"], C6: ["C5"],
      C7: ["C6"],
    },
    optimized: {
      P1: [], P2: ["P1"], P3: ["P2"],
      P4: ["P1"], P5: ["P1"],
      C1: ["P3", "P4", "P5"], C2: ["C1", "P3"],
      C3: ["C2", "P4"], C4: ["C3"],
      C5: ["C4", "C2", "P5"], C6: ["C5"],
      C7: ["C6"],
    },
  },
};

export default recipe;
