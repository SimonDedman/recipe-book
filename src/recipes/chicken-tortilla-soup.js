import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chicken-tortilla-soup",
  title: "Chicken Tortilla Soup",
  source: "Home recipe",
  cuisine: "Mexican",
  image: "https://images.unsplash.com/photo-1730243338482-78d6ffd943df?w=400&h=300&fit=crop",
  baseServings: 6,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [4, 18],
  notes: "Simple one-pot soup. Prep: 15 min. Cook: 40 min.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Chicken breasts", amount: `${si(2)}`, note: "Poached whole, then shredded" },
      ]},
      { category: "Produce", items: [
        { name: "Yellow onion, medium", amount: `${sf(0.5)}`, note: "Chopped" },
        { name: "Fresh cilantro", amount: `${sf(0.5)} cup chopped`, note: "Plus more for topping" },
        { name: "Garlic cloves", amount: `${si(2)}`, note: "Minced" },
        { name: "Avocados", amount: `${si(2)}`, note: "For topping" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Chopped tomatoes (14oz can)", amount: `${si(1)} ${pl(si(1), "can")}` },
        { name: "Chicken broth", amount: `${si(8)} cups (${s(1920)}ml)` },
      ]},
      { category: "Dry goods", items: [
        { name: "Corn tortillas (6-inch)", amount: `${si(12)}`, note: "Shredded into soup" },
        { name: "Tortilla chips", amount: "For topping" },
      ]},
      { category: "Spices", items: [
        { name: "Ground cumin", amount: `${si(1)} tbsp` },
        { name: "Chili powder", amount: `${si(1)} tbsp` },
        { name: "Ground red pepper (cayenne)", amount: `${sf(0.5)} tsp` },
        { name: "Salt", amount: `${si(2)} tsp` },
        { name: "Black pepper", amount: `${si(1)} tsp` },
      ]},
      { category: "Dairy/Toppings", items: [
        { name: "Sour cream", amount: "For topping" },
        { name: "Shredded cheese (cheddar or Mexican blend)", amount: "For topping" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Chop ${sf(0.5)} onion`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P2", name: `Mince ${si(2)} garlic ${pl(si(2), "clove")}`, duration: prepScale(2, mult), category: "prep", step: 1 },
      { id: "P3", name: `Chop ${sf(0.5)} cup cilantro`, duration: prepScale(2, mult), category: "prep", step: 1 },
      { id: "P4", name: `Measure spices: ${si(1)} tbsp cumin, ${si(1)} tbsp chili powder, ${sf(0.5)} tsp red pepper, ${si(2)} tsp salt, ${si(1)} tsp pepper`, duration: 3, category: "prep", step: 1 },
      { id: "P5", name: `Shred ${si(12)} corn tortillas into strips or rough pieces`, duration: prepScale(3, mult), category: "prep", step: 3 },
      { id: "C1", name: `Combine onion, cilantro, garlic, ${si(1)} ${pl(si(1), "can")} tomatoes, ${si(8)} cups (${s(1920)}ml) broth, and spices in large pot; stir to combine`, duration: 4, category: "cook", step: 1 },
      { id: "C2", name: `Add ${si(2)} whole chicken ${pl(si(2), "breast")}; bring to boil then reduce to simmer`, duration: 5, category: "cook", step: 1 },
      { id: "C3", name: `Simmer ${si(30)} min until chicken is cooked through`, duration: 30, category: "cook", step: 2 },
      { id: "C4", name: `Remove chicken; shred with two forks`, duration: 5, category: "cook", step: 3 },
      { id: "C5", name: `Return shredded chicken to pot; add shredded tortillas; simmer 10 min`, duration: 10, category: "cook", step: 3 },
      { id: "C6", name: `Taste and adjust seasoning; ladle into bowls; top with sour cream, cilantro, cheese, avocado, chips`, duration: 3, category: "cook", step: 4 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2", "P3", "P4"], `Prep: ${j("P1").name}, ${j("P2").name.toLowerCase()}, ${j("P3").name.toLowerCase()}, measure spices`);
    t += Math.max(j("P1").duration, j("P2").duration, j("P3").duration, j("P4").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], j("C3").name);
    push(["P5"], `⭐ GAP: ${j("P5").name} while simmering`);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push([], "SERVE with toppings");
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
    push(["C3"], `Simmer 30 min`, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], j("C6").name, "cook");
    t += j("C6").duration;
    push([], "SERVE with toppings", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1", "P2", "P3", "P4"],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3", "P5"], C5: ["C4"],
      C6: ["C5"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P1", "P2", "P3", "P4"],
      C2: ["C1"], C3: ["C2"],
      C4: ["C3"], C5: ["C4", "P5"],
      C6: ["C5"],
    },
  },
};

export default recipe;
