import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "gumbo",
  title: "Marsha's Gumbo",
  source: "Marsha's family recipe",
  cuisine: "Cajun & Creole",
  image: "https://images.unsplash.com/photo-1689860892307-7db54ab276ba?w=400&h=300&fit=crop",
  baseServings: 6,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [4, 18],
  notes: "Incomplete family recipe, best-effort reconstruction. Make roux first. Seafood + sausage + chicken.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat & Seafood", items: [
        { name: "Chicken thighs (bone-in or boneless)", amount: `${si(4)} thighs (${s(1400)}g)`, note: "Baked separately, then pulled" },
        { name: "Turkey sausage", amount: `${s(1)} lb (${s(450)}g)`, note: "Sliced into rounds" },
        { name: "Shrimp (canned or fresh)", amount: `${s(1)} lb (${s(450)}g)`, note: "Peeled and deveined if fresh; drained if canned" },
        { name: "Crab (canned or fresh)", amount: `${sf(0.5)} lb (${s(225)}g)`, note: "Lump crab meat; drained if canned" },
      ]},
      { category: "Produce", items: [
        { name: "Yellow onions", amount: `${si(2)}, chopped` },
        { name: "Celery stalks", amount: `${si(3)}, diced` },
        { name: "Green bell peppers", amount: `${si(2)}, diced` },
        { name: "Garlic cloves", amount: `${si(4)}, minced` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Stewed diced tomatoes (14 oz / 400g can)", amount: `${si(1)} ${pl(si(1), "can")} (${s(400)}g)` },
        { name: "Chicken stock", amount: `${si(6)} cups (${s(1400)}ml)` },
      ]},
      { category: "Roux", items: [
        { name: "Vegetable oil", amount: `${sf(0.5)} cup (${s(120)}ml)` },
        { name: "All-purpose flour", amount: `${sf(0.5)} cup (${s(65)}g)` },
      ]},
      { category: "Spices", items: [
        { name: "Tony's Creole seasoning", amount: `${si(2)} tsp`, note: "Adjust to taste — it's salty" },
        { name: "Cajun seasoning", amount: `${si(1)} tsp` },
        { name: "Garlic powder", amount: `${si(1)} tsp` },
        { name: "Black pepper", amount: "To taste" },
        { name: "Gumbo filé powder", amount: `${sf(0.5)} tsp`, note: "Stir in at end — do not boil after adding" },
        { name: "Kitchen Bouquet", amount: "Dash", note: "For colour and depth" },
      ]},
      { category: "To serve", items: [
        { name: "Long-grain white rice", amount: `${si(2)} cups (${s(370)}g)`, note: "Cooked separately" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Chop ${si(2)} onions, dice ${si(3)} celery ${pl(si(3), "stalk")}, dice ${si(2)} bell ${pl(si(2), "pepper")} (Holy Trinity)`, duration: prepScale(8, mult), category: "prep", step: 1 },
      { id: "P2", name: `Mince ${si(4)} garlic ${pl(si(4), "clove")}`, duration: prepScale(2, mult), category: "prep", step: 1 },
      { id: "P3", name: `Slice ${s(1)} lb (${s(450)}g) turkey sausage into rounds`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P4", name: `Season ${si(4)} chicken ${pl(si(4), "thigh")} with Tony's Creole seasoning, Cajun seasoning, garlic powder, and pepper`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "C1", name: `Preheat oven to 375°F (190°C); bake seasoned chicken thighs 35-40 min until cooked through`, duration: 42, category: "cook", step: 1, note: "Do this in parallel with roux and vegetable steps" },
      { id: "C2", name: `Make dark roux: heat ${sf(0.5)} cup (${s(120)}ml) vegetable oil in large heavy pot over medium heat; whisk in ${sf(0.5)} cup (${s(65)}g) flour and stir constantly 20-30 min until chocolate brown`, duration: 28, category: "cook", step: 2, note: "CRITICAL — do not stop stirring or it will burn; reduce heat if needed; dark peanut-butter to chocolate colour" },
      { id: "C3", name: `Add Holy Trinity (onion, celery, bell pepper) to roux; stir and cook 5 min`, duration: 5, category: "cook", step: 3 },
      { id: "C4", name: `Add minced garlic; stir 1 min`, duration: 2, category: "cook", step: 3 },
      { id: "C5", name: `Gradually whisk in ${si(6)} cups (${s(1400)}ml) chicken stock, adding a little at a time to prevent lumps`, duration: 5, category: "cook", step: 3 },
      { id: "C6", name: `Add ${si(1)} can (${s(400)}g) diced tomatoes; bring to simmer`, duration: 3, category: "cook", step: 3 },
      { id: "C7", name: `Brown sliced turkey sausage in separate skillet over medium-high heat, 5-7 min; add to pot`, duration: cookScale(7, mult, mult > 1.5 ? "batch" : "fixed"), category: "cook", step: 4, note: "Can do this while roux simmers" },
      { id: "C8", name: `Pull cooked chicken off bone; shred or chunk; add to pot`, duration: 8, category: "cook", step: 4 },
      { id: "C9", name: `Simmer gumbo 30 min, stirring occasionally; add Kitchen Bouquet dash for colour`, duration: 30, category: "cook", step: 4 },
      { id: "C10", name: `Add ${s(1)} lb (${s(450)}g) shrimp and ${sf(0.5)} lb (${s(225)}g) crab; simmer gently 5-8 min until shrimp just pink`, duration: 8, category: "cook", step: 5, note: "Do not overcook seafood — shrimp turns rubbery fast" },
      { id: "C11", name: `Remove from heat; stir in ${sf(0.5)} tsp filé powder; taste and adjust seasoning`, duration: 3, category: "cook", step: 5, note: "Do not boil after adding filé — it becomes stringy" },
      { id: "P5", name: `Cook ${si(2)} cups (${s(370)}g) long-grain white rice per package instructions`, duration: 20, category: "prep", step: 4, note: "Start during final simmer" },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P4", "C1"], `Season and put chicken in oven (${j("C1").duration - 2} min bake). ${j("P4").name}`);
    t += 2; // oven heat-up offset before roux
    push(["P1", "P2", "P3"], `⭐ GAP: While oven heats — ${j("P1").name.toLowerCase()}. ${j("P2").name.toLowerCase()}. ${j("P3").name.toLowerCase()}`);
    t += Math.max(j("P1").duration, j("P2").duration + j("P3").duration) - 2;
    push(["C2"], `Start roux: ${j("C2").name} — stir constantly ~25-30 min`);
    t += j("C2").duration;
    push(["C3"], j("C3").name);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5", "C6"], `${j("C5").name}. ${j("C6").name.toLowerCase()}`);
    t += j("C5").duration + j("C6").duration;
    push(["C7"], j("C7").name);
    push(["C8"], `⭐ GAP: Pull and shred/chunk chicken — ${j("C8").name.toLowerCase()}`);
    t += j("C7").duration;
    t += j("C8").duration;
    push(["C9"], `Simmer ${j("C9").duration} min; add Kitchen Bouquet for colour`);
    push(["P5"], `⭐ GAP: ${j("P5").name}`);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
    push(["C11"], j("C11").name);
    t += j("C11").duration;
    push([], "SERVE over rice");
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
    const prepEnd = t;
    push([], "ALL PREP DONE — Holy Trinity chopped, garlic minced, sausage sliced, chicken seasoned", "prep");

    push(["C1"], `${j("C1").name}`, "cook");
    t += j("C1").duration;
    push(["C2"], `Make dark roux: stir constantly 20-30 min until chocolate brown`, "cook");
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
    push(["C9"], `Simmer ${j("C9").duration} min; add Kitchen Bouquet for colour`, "cook");
    push(["P5"], j("P5").name, "cook");
    t += j("C9").duration;
    push(["C10"], j("C10").name, "cook");
    t += j("C10").duration;
    push(["C11"], j("C11").name, "cook");
    t += j("C11").duration;
    push([], "SERVE over rice", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P4"],
      C2: ["P1", "P2", "P3"],
      C3: ["C2", "P1"],
      C4: ["C3", "P2"],
      C5: ["C4"],
      C6: ["C5"],
      C7: ["P3", "C6"],
      C8: ["C1", "C6"],
      C9: ["C7", "C8"],
      C10: ["C9"],
      C11: ["C10"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [],
      C1: ["P4"],
      C2: [],
      C3: ["C2", "P1"],
      C4: ["C3", "P2"],
      C5: ["C4"],
      C6: ["C5"],
      C7: ["C6", "P3"],
      C8: ["C1", "C6"],
      C9: ["C7", "C8"],
      P5: ["C6"],
      C10: ["C9"],
      C11: ["C10"],
    },
  },
};

export default recipe;
