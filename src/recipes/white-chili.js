import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "white-chili",
  title: "The Best White Chili With Chicken",
  source: "Serious Eats",
  cuisine: "Chili & Tex-Mex",
  image: "https://images.unsplash.com/photo-1581597096506-acefe678d02b?w=400&h=300&fit=crop",
  baseServings: 6,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [4, 18],
  notes: "Roasted green chilies, white beans, chicken. Active: 1h15. Total: 2h15 + overnight bean soak. Can use canned beans.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const canBeans = si(4);
    return [
      { category: "Meat", items: [
        { name: "Boneless skinless chicken breasts", amount: `${s(2)} lb (~${s(900)}g)`, note: `${si(4)} ${pl(si(4), "breast")}` },
      ]},
      { category: "Produce", items: [
        { name: "Poblano chilies", amount: `${si(2)}` },
        { name: "Anaheim or Hatch chilies", amount: `${si(4)}` },
        { name: "Jalapeños (fresh)", amount: `${si(2)}` },
        { name: "Medium onion, halved", amount: `${si(1)}` },
        { name: "Garlic cloves", amount: `${si(8)}` },
        { name: "Scallions", amount: `${si(4)}-${si(6)}, sliced` },
        { name: "Limes", amount: `${si(2)}`, note: "1 juiced (2 tbsp), 1 in wedges" },
        { name: "Fresh cilantro", amount: `${si(1)} cup, chopped (divided)` },
      ]},
      { category: "Beans", items: [
        { name: "Dried navy/Great Northern/cannellini beans", amount: `${s(1)} lb (${s(450)}g)`, note: `Or ${canBeans} × 15oz ${pl(canBeans, "can")} if skipping soak` },
      ]},
      { category: "Dairy", items: [
        { name: "Pepper Jack cheese, shredded", amount: `${s(1)} lb (${s(450)}g)`, note: "Divided — half in pot, half for serving" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Chicken stock", amount: `${si(1)} quart (${s(960)}ml)` },
        { name: "Pickled jalapeños", amount: `${si(1)} pickled jalapeño + ${si(2)} tbsp pickling liquid` },
      ]},
      { category: "Spices", items: [
        { name: "Ground cumin", amount: `${si(1)} tbsp` },
        { name: "Ground coriander", amount: `${si(1)} tsp` },
        { name: "Salt", amount: "To taste" },
      ]},
      { category: "Oil", items: [
        { name: "Vegetable oil", amount: `${si(3)} tbsp (${s(45)}ml)` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Soak ${s(1)} lb (${s(450)}g) dried beans overnight in salted water`, duration: 2, category: "prep", step: 1, note: "Do the night before; or use canned beans" },
      { id: "P2", name: `Arrange ${si(2)} poblanos, ${si(4)} Anaheim/Hatch chilies, ${si(2)} jalapeños, ${si(1)} halved onion, ${si(8)} garlic cloves on baking sheet`, duration: prepScale(4, mult), category: "prep", step: 2 },
      { id: "C1", name: `Broil chilies, onion, garlic 15-20 min until charred, turning once`, duration: 18, category: "cook", step: 2, note: "Watch closely; garlic may be done sooner" },
      { id: "C2", name: `Transfer broiled chilies to foil pouch; seal and steam 10 min`, duration: 10, category: "cook", step: 2 },
      { id: "P3", name: `Peel and deseed steamed chilies; rough-chop flesh`, duration: prepScale(8, mult), category: "prep", step: 3 },
      { id: "P4", name: `Blend chili flesh, onion, garlic, ${si(1)} pickled jalapeño with ${si(1)} quart (${s(960)}ml) stock → strain into pot`, duration: prepScale(5, mult), category: "prep", step: 3 },
      { id: "P5", name: `Drain soaked beans (or open ${si(4)} ${pl(si(4), "can")} canned beans and drain)`, duration: 2, category: "prep", step: 4 },
      { id: "C3", name: `Heat ${si(3)} tbsp (${s(45)}ml) vegetable oil in large pot over medium-high`, duration: 2, category: "cook", step: 4 },
      { id: "C4", name: `Cook ${si(1)} tbsp cumin + ${si(1)} tsp coriander in oil 30 sec until fragrant`, duration: 1, category: "cook", step: 4 },
      { id: "C5", name: `Add chili purée to pot; stir to combine`, duration: 2, category: "cook", step: 4 },
      { id: "C6", name: `Add drained beans and ${si(4)} ${pl(si(4), "chicken breast")} (${s(2)} lb) to pot; bring to simmer`, duration: 5, category: "cook", step: 4 },
      { id: "C7", name: `Simmer until chicken reaches 150°F (~15 min); remove chicken to board`, duration: 15, category: "cook", step: 5, note: "Use instant-read thermometer" },
      { id: "C8", name: `Continue simmering beans ~45 min until tender (1h total from adding beans)`, duration: 45, category: "cook", step: 5 },
      { id: "C9", name: `Blend or mash 1½ cups beans from pot; stir back in to thicken`, duration: 5, category: "cook", step: 6 },
      { id: "C10", name: `Shred rested chicken with two forks`, duration: prepScale(5, mult), category: "cook", step: 6 },
      { id: "C11", name: `Stir shredded chicken, half cheese (${sf(0.5)} lb), ${si(2)} tbsp pickling liquid, ${si(2)} tbsp lime juice, half cilantro (${sf(0.5)} cup) into soup`, duration: 4, category: "cook", step: 6 },
      { id: "P6", name: `Slice ${si(4)}-${si(6)} scallions; chop remaining ${sf(0.5)} cup cilantro; cut ${si(1)} lime into wedges; shred remaining cheese`, duration: prepScale(5, mult), category: "prep", step: 6 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1"], `NIGHT BEFORE: ${j("P1").name}`);
    push([], "── DAY OF ──");
    push(["P2"], j("P2").name);
    t += j("P2").duration;
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], `${j("C2").name} — seal in foil pouch`);
    t += j("C2").duration;
    push(["P3"], j("P3").name);
    t += j("P3").duration;
    push(["P4", "P5"], `${j("P4").name}. ${j("P5").name}`);
    t += Math.max(j("P4").duration, j("P5").duration);
    push(["C3", "C4"], `${j("C3").name}. ${j("C4").name}`);
    t += j("C3").duration + j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push(["C7"], j("C7").name);
    t += j("C7").duration;
    push(["C8"], `${j("C8").name}`);
    push(["P6"], `⭐ GAP: ${j("P6").name} — while beans simmer`);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
    push(["C11"], j("C11").name);
    t += j("C11").duration;
    push([], "SERVE with extra cheese, lime wedges, cilantro, scallions");
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
    push(["P5"], j("P5").name, "prep");
    t += j("P5").duration;
    push(["P6"], j("P6").name, "prep");
    t += j("P6").duration;
    const prepEnd = t;
    push([], "ALL PRE-PREP DONE — broil when ready to cook", "prep");

    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], `Seal chilies in foil pouch; steam 10 min`, "cook");
    t += j("C2").duration;
    push(["P3"], j("P3").name, "cook");
    t += j("P3").duration;
    push(["P4"], j("P4").name, "cook");
    t += j("P4").duration;
    push(["C3", "C4"], `${j("C3").name}. ${j("C4").name}`, "cook");
    t += j("C3").duration + j("C4").duration;
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
    push(["C11"], j("C11").name, "cook");
    t += j("C11").duration;
    push([], "SERVE with extra cheese, lime wedges, cilantro, scallions", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: ["C2"], P4: ["P3"], P5: ["P1"],
      P6: [],
      C1: ["P2"], C2: ["C1"], C3: ["P4", "P5"],
      C4: ["C3"], C5: ["C4", "P4"], C6: ["C5", "P5"],
      C7: ["C6"], C8: ["C7"], C9: ["C8"], C10: ["C7"],
      C11: ["C9", "C10", "P6"],
    },
    optimized: {
      P1: [], P2: [], P3: ["C2"], P4: ["P3"], P5: ["P1"],
      P6: ["C7"],
      C1: ["P2"], C2: ["C1"], C3: ["P4", "P5"],
      C4: ["C3"], C5: ["C4", "P4"], C6: ["C5", "P5"],
      C7: ["C6"], C8: ["C7"], C9: ["C8"], C10: ["C7"],
      C11: ["C9", "C10", "P6"],
    },
  },
};

export default recipe;
