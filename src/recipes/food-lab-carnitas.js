import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "food-lab-carnitas",
  title: "Food Lab No-Waste Tacos de Carnitas",
  source: "Serious Eats, Food Lab",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [3, 12],
  notes: "Oven-braised, then broiled crisp. With homemade salsa verde. Active: 45 min. Total: 4½h. Prep up to 3 days ahead.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const tortillas = si(24);
    return [
      { category: "Meat", items: [
        { name: "Boneless pork butt, cut into 2-inch cubes", amount: `${s(3)} lb` },
      ]},
      { category: "Produce", items: [
        { name: "Medium onions", amount: `${si(2)}`, note: "1 quartered for braise, 1 for serving" },
        { name: "Fresh cilantro, chopped", amount: `${sf(0.5)} cup` },
        { name: "Orange", amount: `${si(1)} medium` },
        { name: "Garlic cloves, halved", amount: `${si(6)}` },
        { name: "Tomatillos, husked and halved", amount: `${s(1.5)} lb (${si(6)} medium)` },
        { name: "Jalapeños, halved", amount: `${si(2)}` },
        { name: "Limes", amount: `${si(3)}`, note: "Cut into wedges for serving" },
      ]},
      { category: "Dairy", items: [
        { name: "Queso fresco or feta, crumbled", amount: `${si(1)} cup (${s(4)} oz)` },
      ]},
      { category: "Dry goods", items: [
        { name: "Corn tortillas", amount: `${tortillas}`, note: `~${si(6)} per person` },
        { name: "Vegetable oil", amount: `${sf(0.25)} cup` },
      ]},
      { category: "Pantry", items: [
        { name: "Kosher salt", amount: "Generous" },
        { name: "Bay leaves", amount: `${si(2)}` },
        { name: "Cinnamon stick (broken)", amount: `${si(1)}` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const tortillas = si(24);

    return [
      { id: "P1", name: `Season ${s(3)} lb pork cubes generously with kosher salt`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P2", name: `Quarter 1 onion; halve ${si(6)} garlic cloves; cut ${si(1)} orange in half`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Preheat oven to 275°F (135°C)`, duration: 1, category: "prep", step: 1, note: "~15 min to heat" },
      { id: "C1", name: `Arrange seasoned pork in 9×13 casserole; tuck in quartered onion, ${si(6)} garlic halves, ${si(2)} bay leaves, ${si(1)} cinnamon stick; squeeze orange over top; drizzle ${sf(0.25)} cup vegetable oil`, duration: prepScale(5, mult), category: "cook", step: 2 },
      { id: "C2", name: `Cover tightly with foil; braise in oven at 275°F for 3½ hours`, duration: 210, category: "cook", step: 2, note: "Pork should be very tender" },
      { id: "P4", name: `Husk and halve ${s(1.5)} lb tomatillos; halve ${si(2)} jalapeños; slice ${si(1)} onion into rings`, duration: prepScale(8, mult), category: "prep", step: 3 },
      { id: "P5", name: `Chop ${sf(0.5)} cup cilantro; cut ${si(3)} limes into wedges; crumble ${si(1)} cup queso fresco`, duration: prepScale(5, mult), category: "prep", step: 3 },
      { id: "C3", name: `Remove pork from casserole; strain braising liquid into bowl — reserve both liquid and fat`, duration: prepScale(5, mult), category: "cook", step: 3 },
      { id: "C4", name: `Shred pork with two forks; toss with reserved fat`, duration: prepScale(10, mult), category: "cook", step: 3 },
      { id: "C5", name: `Salsa verde: simmer tomatillos, onion rings, garlic, jalapeños in reserved pork liquid 10 min until soft`, duration: 12, category: "cook", step: 3 },
      { id: "C6", name: `Blend salsa verde smooth; season with salt`, duration: prepScale(3, mult), category: "cook", step: 3 },
      { id: "C7", name: `Spread shredded pork on rimmed baking sheet; broil 6 min, stir, broil 6 min more until crisp`, duration: 13, category: "cook", step: 4, note: mult > 2 ? "Work in batches" : "Watch closely at 5 min" },
      { id: "C8", name: `Warm ${tortillas} corn tortillas in dry skillet over medium heat`, duration: 5, category: "cook", step: 4 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P3", "P1"], `Preheat oven to 275°F. ${j("P1").name}`);
    t += j("P1").duration;
    push(["P2"], j("P2").name);
    t += j("P2").duration;
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], `Foil on, into oven — 3½ hours`);
    push(["P4", "P5"], `⭐ GAP: ${j("P4").name}. ${j("P5").name} — prep during braise`);
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
    push([], "SERVE — tacos with salsa verde, cilantro, queso fresco, lime wedges");
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
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    push(["P5"], j("P5").name, "prep");
    t += j("P5").duration;
    const prepEnd = t;
    push([], "ALL PREP DONE — pork seasoned, veg prepped, garnishes ready", "prep");

    push(["P3"], j("P3").name, "cook");
    t += j("P3").duration;
    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], `Foil on, into oven — 3½ hours`, "cook");
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
    push([], "SERVE — tacos with salsa verde, cilantro, queso fresco, lime wedges", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2"],
      C2: ["C1", "P3"],
      P4: [], P5: [],
      C3: ["C2"], C4: ["C3"],
      C5: ["C3", "P4"], C6: ["C5"],
      C7: ["C4"], C8: [],
    },
    optimized: {
      P1: [], P2: [], P3: [],
      C1: ["P1", "P2"],
      C2: ["C1", "P3"],
      P4: ["C1"], P5: ["C1"],
      C3: ["C2"], C4: ["C3"],
      C5: ["C3", "P4"], C6: ["C5"],
      C7: ["C4"], C8: ["C7"],
    },
  },
};

export default recipe;
