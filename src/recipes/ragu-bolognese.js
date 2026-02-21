import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "ragu-bolognese",
  title: "Pressure Cooker Ragù Bolognese",
  source: "Serious Eats",
  baseServings: 8,
  multiplierOptions: [1, 1.5, 2],
  servingsRange: [4, 16],
  notes: "Rich, multi-meat ragù. Active: 1h. Total: 2½h with pressure cooker. Stores 1 week fridge.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Pancetta, diced", amount: `${s(225)}g (${sf(0.5)} lb)` },
        { name: "Chicken livers", amount: `${s(225)}g (${sf(0.5)} lb)`, note: "Minced fine" },
        { name: "Ground beef chuck", amount: `${s(900)}g (${si(2)} lb)` },
        { name: "Ground pork shoulder", amount: `${s(450)}g (${si(1)} lb)` },
      ]},
      { category: "Produce", items: [
        { name: "Large onion (300g each)", amount: `${si(1)}`, note: "Minced" },
        { name: "Large carrots (100g each)", amount: `${si(2)}`, note: "Chopped" },
        { name: "Celery stalks (100g each)", amount: `${si(2)}`, note: "Chopped" },
        { name: "Garlic cloves", amount: `${si(4)}`, note: "Minced" },
        { name: "Fresh sage leaves", amount: `${sf(0.25)} cup`, note: "Minced" },
        { name: "Fresh parsley", amount: `${sf(0.5)} cup`, note: "Minced, divided: half in, half to finish" },
        { name: "Fresh basil", amount: `${sf(0.25)} cup`, note: "Minced, stirred in at end" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Crushed tomatoes, 14 oz / 400g can", amount: `${si(1)} ${pl(si(1), "can")}` },
        { name: "Fish sauce", amount: `${si(1)}-${si(2)} tbsp` },
      ]},
      { category: "Dairy", items: [
        { name: "Heavy cream", amount: `${s(350)}ml (1${sf(0.5)} cups)`, note: "Divided: 1 cup in pot, remainder to finish" },
        { name: "Parmesan, grated", amount: `${s(80)}g (${si(3)} oz)` },
      ]},
      { category: "Dry goods", items: [
        { name: "Pappardelle or tagliatelle", amount: `${s(675)}g (1${sf(0.5)} lb)`, note: "To serve" },
        { name: "Gelatin packets (7g each)", amount: `${si(4)} ${pl(si(4), "packet")} (${s(30)}g)`, note: "To bloom in stock" },
      ]},
      { category: "Liquid", items: [
        { name: "Chicken stock", amount: `${s(225)}ml (${si(1)} cup)` },
        { name: "Dry red wine", amount: `${s(450)}ml (${si(2)} cups)` },
        { name: "EVOO", amount: `${si(2)} tbsp` },
      ]},
      { category: "Spices & Condiments", items: [
        { name: "Bay leaves", amount: `${si(2)}` },
        { name: "Salt", amount: "To taste" },
        { name: "Black pepper", amount: "To taste" },
      ]},
      { category: "Equipment/Supplies", items: [
        { name: "Pressure cooker or Instant Pot", amount: "1" },
        { name: "Large heavy-bottomed pot or Dutch oven", amount: "1", note: "For browning" },
        { name: "Large deli containers for storage", amount: `${si(2)}+` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Bloom ${si(4)} gelatin ${pl(si(4), "packet")} (${s(30)}g) in ${s(225)}ml chicken stock for 5 min; set aside`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P2", name: `Mince ${si(1)} large onion (${s(300)}g)`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "P3", name: `Chop ${si(2)} large ${pl(si(2), "carrot")} (${s(200)}g) and ${si(2)} celery ${pl(si(2), "stalk")} (${s(200)}g)`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P4", name: `Mince ${si(4)} garlic ${pl(si(4), "clove")}, ${sf(0.25)} cup sage leaves, half of ${sf(0.5)} cup parsley`, duration: prepScale(5, mult), category: "prep", step: 2 },
      { id: "P5", name: `Mince ${s(225)}g (${sf(0.5)} lb) chicken livers fine`, duration: prepScale(4, mult), category: "prep", step: 2 },
      { id: "P6", name: `Measure ${s(900)}g ground beef, ${s(450)}g ground pork; season well with salt & pepper`, duration: 2, category: "prep", step: 2 },
      { id: "P7", name: `Measure ${s(450)}ml red wine, open ${si(1)} can crushed tomatoes, measure ${s(350)}ml heavy cream (divide: ${s(225)}ml for pot, ${s(125)}ml to finish)`, duration: 3, category: "prep", step: 3 },
      { id: "C1", name: `Heat ${si(2)} tbsp EVOO in large pot over medium-high; brown ${s(225)}g pancetta until golden, ~12 min`, duration: cookScale(12, mult, "fixed"), category: "cook", step: 1 },
      { id: "C2", name: `Add minced onion, carrot, celery, garlic, sage, and half the parsley; sauté until vegetables softened, ~8 min`, duration: 8, category: "cook", step: 2 },
      { id: "C3", name: `Add ${s(225)}g minced chicken livers; cook until no longer pink, ~5 min`, duration: 5, category: "cook", step: 3 },
      { id: "C4", name: `Add ${s(900)}g ground beef + ${s(450)}g ground pork${mult > 1 ? " in batches" : ""}; brown, breaking up lumps, ~10 min`, duration: cookScale(10, mult, mult > 1 ? "batch" : "fixed"), category: "cook", step: 4, note: mult > 1 ? "Work in batches to ensure browning, not steaming" : "" },
      { id: "C5", name: `Stir over high heat until all liquid evaporated and meat begins to sizzle, ~25 min`, duration: 25, category: "cook", step: 5, note: "This step is key — must be dry before adding liquids" },
      { id: "C6", name: `Add bloomed stock/gelatin, ${s(450)}ml red wine, ${si(1)} can crushed tomatoes, ${s(225)}ml heavy cream, ${si(2)} bay leaves; stir to combine`, duration: 3, category: "cook", step: 6 },
      { id: "C7", name: `Pressure cook on high for 30 min; natural release 15 min`, duration: 45, category: "cook", step: 7, note: "Or simmer covered on very low heat 2-3h if no pressure cooker" },
      { id: "C8", name: `Simmer uncovered to reduce and concentrate, stirring often, ~30-45 min`, duration: mult > 1 ? 45 : 35, category: "cook", step: 8, note: "Sauce should coat a spoon thickly" },
      { id: "C9", name: `Stir in remaining ${s(125)}ml heavy cream, ${s(80)}g grated Parmesan, ${si(1)}-${si(2)} tbsp fish sauce, ${sf(0.25)} cup minced basil, remaining parsley; discard bay leaves`, duration: 3, category: "cook", step: 9 },
      { id: "C10", name: `Cook ${s(675)}g pasta in heavily salted boiling water until al dente; drain, reserving 1 cup pasta water; toss with ragù`, duration: 12, category: "cook", step: 10 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P1"], j("P1").name);
    t += j("P1").duration;
    push(["P2", "P3"], `${j("P2").name}. ${j("P3").name}`);
    t += Math.max(j("P2").duration, j("P3").duration);
    push(["P4", "P5"], `${j("P4").name}. ${j("P5").name}`);
    t += Math.max(j("P4").duration, j("P5").duration);
    push(["P6", "P7"], `${j("P6").name}. ${j("P7").name}`);
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
    push(["C7"], "Into pressure cooker — 30 min high, 15 min natural release");
    push([], `⭐ GAP: ${j("C7").duration} min pressure cook — clean up`);
    t += j("C7").duration;
    push(["C8"], j("C8").name);
    push([], `⭐ GAP: ${j("C8").duration} min simmer — prep pasta water, set table`);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push(["C10"], j("C10").name);
    t += j("C10").duration;
    push([], "🍽️ SERVE with extra Parmesan");
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
    push([], "✅ ALL PREP DONE — delis loaded, ready to cook", "prep");

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
    push(["C7"], `Into pressure cooker — 30 min high, 15 min natural release`, "cook");
    t += j("C7").duration;
    push(["C8"], `Simmer uncovered ${j("C8").duration} min to reduce`, "cook");
    t += j("C8").duration;
    push(["C9"], j("C9").name, "cook");
    t += j("C9").duration;
    push(["C10"], j("C10").name, "cook");
    t += j("C10").duration;
    push([], "🍽️ SERVE with extra Parmesan", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [], P4: [], P5: [], P6: [], P7: [],
      C1: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"],
      C2: ["C1", "P2", "P3", "P4"],
      C3: ["C2", "P5"],
      C4: ["C3", "P6"],
      C5: ["C4"],
      C6: ["C5", "P1", "P7"],
      C7: ["C6"],
      C8: ["C7"],
      C9: ["C8", "P4", "P7"],
      C10: ["C9"],
    },
    optimized: {
      P1: [], P2: [], P3: [], P4: [], P5: [], P6: [], P7: [],
      C1: ["P6"],
      C2: ["C1", "P2", "P3", "P4"],
      C3: ["C2", "P5"],
      C4: ["C3"],
      C5: ["C4"],
      C6: ["C5", "P1", "P7"],
      C7: ["C6"],
      C8: ["C7"],
      C9: ["C8", "P4"],
      C10: ["C9"],
    },
  },
};

export default recipe;
