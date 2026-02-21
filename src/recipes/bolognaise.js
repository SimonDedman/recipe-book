import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "bolognaise",
  title: "Spaghetti Bolognaise",
  source: "Classic British-Italian",
  baseServings: 5,
  multiplierOptions: [1, 1.5, 2, 2.5, 3, 4],
  servingsRange: [3, 20],
  notes: "Rich, slow-simmered meat sauce. Prep: 20 mins. Cook: 1h30-2h simmer. Freezes well.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const tomatoCans = Math.ceil(1.7 * mult);
    return [
      { category: "Meat", items: [
        { name: "Pancetta or smoked bacon lardons", amount: `${s(141)}g` },
        { name: "Beef mince", amount: `${s(563)}g` },
        { name: "Pork mince", amount: `${s(281)}g` },
      ]},
      { category: "Produce", items: [
        { name: "Large yellow onion", amount: `${si(1)}` },
        { name: "Celery ribs", amount: `${si(5)}` },
        { name: "Large carrots", amount: `${sf(2.5)}` },
        { name: "Garlic cloves", amount: `${si(10)}` },
        { name: "Fresh parsley", amount: "Small bunch" },
        { name: "Fresh rosemary", amount: `${si(1)} sprig` },
        { name: "Fresh thyme", amount: `${si(2)} sprigs` },
        { name: "Fresh basil", amount: "Small bunch" },
        { name: "Fresh sage", amount: `${si(3)} leaves` },
        { name: "Bay leaves", amount: `${si(2)}` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Tomato sauce / passata (400g)", amount: `${tomatoCans} ${pl(tomatoCans, "can")}`, note: `Need ~${s(680)}g total` },
        { name: "Chicken stock cubes", amount: `${sf(0.3)}` },
      ]},
      { category: "Dairy", items: [
        { name: "Butter", amount: `${s(200)}g` },
        { name: "Parmesan, grated", amount: `${s(50)}g`, note: "To serve" },
      ]},
      { category: "Dry goods", items: [
        { name: "Rigatoni or penne pasta", amount: `${s(750)}g` },
        { name: "Salt", amount: `${s(25)}g`, note: "For pasta water + sauce" },
      ]},
      { category: "Liquid", items: [
        { name: "Red wine", amount: `${s(281)}ml` },
        { name: "Worcestershire sauce", amount: `${s(19)}ml` },
        { name: "Olive oil", amount: `${si(2)} tbsp`, note: "For frying" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Dice ${si(1)} large onion finely`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P2", name: `Dice ${si(5)} celery ${pl(si(5), "rib")} finely`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Dice ${sf(2.5)} large ${pl(Math.ceil(2.5 * mult), "carrot")} finely`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P4", name: `Mince ${si(10)} garlic ${pl(si(10), "clove")}`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P5", name: `Pick & chop fresh herbs: parsley, rosemary, thyme, basil, sage; set aside ${si(2)} bay leaves`, duration: prepScale(4, mult), category: "prep", step: 2 },
      { id: "P6", name: `Measure ${s(141)}g pancetta, ${s(563)}g beef mince, ${s(281)}g pork mince`, duration: 2, category: "prep", step: 2 },
      { id: "P7", name: `Measure ${s(281)}ml red wine, ${s(19)}ml Worcestershire sauce, ${s(680)}g tomato sauce; dissolve ${sf(0.3)} stock cube in small amount of boiling water`, duration: 3, category: "prep", step: 2 },
      { id: "C1", name: `Melt ${s(200)}g butter with ${si(2)} tbsp olive oil over medium heat`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Fry ${s(141)}g pancetta until golden, ~5 min`, duration: 5, category: "cook", step: 1 },
      { id: "C3", name: `Add onion, garlic; cook until softened, ~5 min`, duration: 5, category: "cook", step: 2 },
      { id: "C4", name: `Add ${s(563)}g beef + ${s(281)}g pork mince; brown, breaking up, ~8 min`, duration: cookScale(8, mult, "batch"), category: "cook", step: 2, note: mult > 2 ? "Work in batches if needed" : "" },
      { id: "C5", name: `Pour in ${s(281)}ml red wine; stir and reduce until almost evaporated, ~5 min`, duration: 5, category: "cook", step: 3 },
      { id: "C6", name: `Add ${s(680)}g tomato sauce, celery, carrot, stock, ${s(19)}ml Worcestershire sauce, herbs & bay leaves; stir well`, duration: 3, category: "cook", step: 3 },
      { id: "C7", name: `Bring to simmer, reduce heat to very low; cover & simmer ${mult > 2 ? "2h" : "1h30"}, stirring occasionally`, duration: mult > 2 ? 120 : 90, category: "cook", step: 4, note: "Sauce should be thick and rich" },
      { id: "C8", name: `Season generously with salt & pepper; remove bay leaves & whole herb stems`, duration: 3, category: "cook", step: 5 },
      { id: "C9", name: `Cook ${s(750)}g pasta in heavily salted boiling water until al dente; drain, reserving 1 cup pasta water`, duration: 12, category: "cook", step: 5 },
      { id: "C10", name: `Toss pasta with sauce, adding pasta water if needed; serve with ${s(50)}g grated parmesan`, duration: 3, category: "cook", step: 6 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1", "P2", "P3", "P4"], `Dice onion, celery, carrot; mince garlic`);
    t += Math.max(j("P1").duration, j("P2").duration, j("P3").duration, j("P4").duration);
    push(["P5"], j("P5").name);
    t += j("P5").duration;
    push(["P6", "P7"], `Weigh meats. Measure liquids, tomatoes, dissolve stock cube`);
    t += Math.max(j("P6").duration, j("P7").duration);
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
    push(["C7"], `Cover & simmer on very low heat`);
    push([], `⭐ GAP: ${j("C7").duration} min simmer — prep sides, clean up`);
    t += j("C7").duration;
    push(["C8"], j("C8").name);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
    push([], "SERVE with extra parmesan");
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
    push(["P6"], j("P6").name, "prep");
    t += j("P6").duration;
    push(["P7"], j("P7").name, "prep");
    t += j("P7").duration;
    const prepEnd = t;
    push([], "ALL PREP DONE — delis loaded, ready to cook", "prep");

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
    push(["C7"], `Cover & simmer ${j("C7").duration} min on very low heat`, "cook");
    t += j("C7").duration;
    push(["C8"], j("C8").name, "cook");
    t += j("C8").duration;
    push(["C9"], j("C9").name, "cook");
    t += j("C9").duration;
    push(["C10"], j("C10").name, "cook");
    t += j("C10").duration;
    push([], "SERVE with extra parmesan", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [], P6: [], P7: [],
      C1: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
      C2: ["C1"], C3: ["C2", "P1", "P4"],
      C4: ["C3", "P6"], C5: ["C4"],
      C6: ["C5", "P2", "P3", "P5", "P7"],
      C7: ["C6"], C8: ["C7"],
      C9: ["C8"], C10: ["C9", "C8"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [], P6: [], P7: [],
      C1: ["P6"],
      C2: ["C1"], C3: ["C2", "P1", "P4"],
      C4: ["C3"], C5: ["C4"],
      C6: ["C5", "P2", "P3", "P5", "P7"],
      C7: ["C6"], C8: ["C7"],
      C9: ["C8"], C10: ["C9"],
    },
  },
};

export default recipe;
