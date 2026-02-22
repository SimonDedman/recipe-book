import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "chicken-korma",
  title: "Chicken Korma & Pilau Rice",
  source: "Josh & Sheddy",
  cuisine: "Indian",
  image: "https://images.unsplash.com/premium_photo-1723708871094-2c02cf5f5394?w=400&h=300&fit=crop",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3, 3.5],
  servingsRange: [2, 14],
  notes: "Marinate chicken overnight. Prep: 30 mins (+ overnight). Cook: ~40 mins korma + 25 mins rice.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Korma — Meat & Marinade", items: [
        { name: "Bone-in or boneless chicken thighs", amount: `${s(680)}g` },
        { name: "Plain yoghurt", amount: `${s(240)}g`, note: "For marinade" },
        { name: "Garam masala (marinade)", amount: `${si(1)} tbsp` },
        { name: "Salt (marinade)", amount: `${si(1)} tbsp` },
        { name: "Ginger puree (marinade)", amount: `${si(2)} tsp` },
        { name: "Garlic puree (marinade)", amount: `${si(2)} tsp` },
      ]},
      { category: "Korma — Sauce", items: [
        { name: "Butter", amount: `${s(60)}g` },
        { name: "Cinnamon stick", amount: `${sf(2.5)} cm piece` },
        { name: "Yellow onion", amount: `${si(1)}` },
        { name: "Fresh ginger", amount: `${si(2)} inch ${pl(si(2), "piece")}` },
        { name: "Garlic cloves", amount: `${si(6)}` },
        { name: "Paprika", amount: `${si(2)} tsp` },
        { name: "Ground cumin", amount: `${si(2)} tsp` },
        { name: "Garam masala (sauce)", amount: `${si(1)} tbsp` },
        { name: "Turmeric", amount: `${sf(1.5)} tsp` },
        { name: "Coriander powder", amount: `${si(3)} tsp` },
        { name: "Chilli powder", amount: `${si(1)} tsp` },
        { name: "Ground cardamom", amount: `${si(1)} tsp` },
        { name: "Coconut powder", amount: `${si(2)} tsp` },
        { name: "Heavy cream", amount: `${s(240)}ml` },
        { name: "Cashew nuts", amount: `${s(50)}g`, note: "Blended to paste" },
        { name: "Boiling water", amount: `${s(200)}ml` },
        { name: "Fresh coriander", amount: `${si(4)} ${pl(si(4), "sprig")}`, note: "Garnish" },
      ]},
      { category: "Pilau Rice", items: [
        { name: "Basmati rice", amount: `${s(340)}g` },
        { name: "Vegetable oil", amount: `${si(3)} tbsp` },
        { name: "Cinnamon stick (rice)", amount: `${si(1)}` },
        { name: "Cloves", amount: `${si(4)}` },
        { name: "Bay leaves", amount: `${si(1)}` },
        { name: "Onion", amount: `${si(1)}` },
        { name: "Ground cardamom (rice)", amount: `${sf(0.5)} tsp` },
        { name: "Ground cumin (rice)", amount: `${sf(0.5)} tsp` },
        { name: "Salt (rice)", amount: `${sf(0.16)} tbsp` },
        { name: "Turmeric (rice)", amount: `${sf(0.5)} tsp` },
        { name: "Black peppercorns", amount: `${si(6)}` },
        { name: "Green chili", amount: `${si(1)}` },
        { name: "Garlic cloves (rice)", amount: `${si(2)}` },
        { name: "Fresh ginger (rice)", amount: `${sf(2.5)} cm` },
        { name: "Boiling water or stock", amount: `${s(756)}ml` },
        { name: "Butter (rice)", amount: `${s(27)}g` },
        { name: "Frozen peas", amount: `${s(125)}g` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      // ── OVERNIGHT PREP ──
      { id: "M1", name: `Marinate ${s(680)}g chicken: mix ${s(240)}g yoghurt, ${si(1)} tbsp garam masala, ${si(1)} tbsp salt, ${si(2)} tsp ginger puree, ${si(2)} tsp garlic puree; coat chicken; cover & refrigerate overnight`, duration: prepScale(8, mult), category: "prep", step: 0, note: "Night before" },

      // ── KORMA PREP ──
      { id: "P1", name: `Slice ${si(1)} yellow onion thinly`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P2", name: `Mince ${si(6)} garlic ${pl(si(6), "clove")} and ${si(2)} inch fresh ginger`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Measure korma spices: ${si(2)} tsp paprika, ${si(2)} tsp cumin, ${si(1)} tbsp garam masala, ${sf(1.5)} tsp turmeric, ${si(3)} tsp coriander pwd, ${si(1)} tsp chilli pwd, ${si(1)} tsp cardamom`, duration: 3, category: "prep", step: 1 },
      { id: "P4", name: `Blend ${s(50)}g cashews with a splash of water to a smooth paste; measure ${s(200)}ml boiling water, ${s(240)}ml cream, ${si(2)} tsp coconut powder`, duration: prepScale(5, mult), category: "prep", step: 1 },

      // ── PILAU RICE PREP ──
      { id: "P5", name: `Wash ${s(340)}g basmati rice under cold water until clear; drain`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P6", name: `Slice ${si(1)} onion (rice); mince ${si(2)} garlic ${pl(si(2), "clove")}, ${sf(2.5)} cm ginger; slice ${si(1)} green chili; measure rice spices: ${sf(0.5)} tsp cardamom, ${sf(0.5)} tsp cumin, ${sf(0.16)} tbsp salt, ${sf(0.5)} tsp turmeric, ${si(6)} peppercorns`, duration: prepScale(6, mult), category: "prep", step: 1 },

      // ── KORMA COOK ──
      { id: "C1", name: `Melt ${s(60)}g butter in wide pan over medium heat; add ${sf(2.5)} cm cinnamon stick, fry 30 sec`, duration: 2, category: "cook", step: 2 },
      { id: "C2", name: `Add sliced onion; fry 6 min until golden`, duration: 6, category: "cook", step: 2 },
      { id: "C3", name: `Add minced ginger, garlic; cook 1 min until fragrant`, duration: 1, category: "cook", step: 2 },
      { id: "C4", name: `Add all korma spices; stir 1 min`, duration: 1, category: "cook", step: 2 },
      { id: "C5", name: `Add marinated chicken; cook 5 min, turning to coat`, duration: 5, category: "cook", step: 3 },
      { id: "C6", name: `Add ${si(2)} tsp coconut powder; stir; cover with lid, simmer 10 min`, duration: 10, category: "cook", step: 3 },
      { id: "C7", name: `Add ${s(240)}ml cream, cashew paste, ${s(200)}ml boiling water; simmer uncovered 15 min until sauce thickens`, duration: 15, category: "cook", step: 3 },
      { id: "C8", name: `Garnish korma with fresh coriander; keep warm on lowest heat`, duration: 2, category: "cook", step: 4 },

      // ── OVEN PREHEAT ──
      { id: "P7", name: `Preheat oven to 350°F (175°C)`, duration: 1, category: "prep", step: 3, note: "~20 min to heat; start when korma lid goes on" },

      // ── PILAU RICE COOK (parallel with korma from C6 onward) ──
      { id: "R1", name: `Heat ${si(3)} tbsp veg oil in ovenproof pan; fry cinnamon stick, ${si(4)} cloves, ${si(1)} bay ${pl(si(1), "leaf")} 3 min`, duration: 3, category: "cook", step: 3, note: "Start ~10 min after korma C5" },
      { id: "R2", name: `Add sliced onion, garlic, ginger, green chili; sauté 10 min until golden`, duration: 10, category: "cook", step: 3 },
      { id: "R3", name: `Add ground spices (cardamom, cumin, salt, turmeric, peppercorns) and drained rice; stir 2 min`, duration: 2, category: "cook", step: 3 },
      { id: "R4", name: `Pour in ${s(756)}ml boiling water/stock; bring to boil; transfer to oven at 350°F (175°C); bake 20-25 min`, duration: mult > 2 ? 25 : 22, category: "cook", step: 4, note: "Covered with foil or lid" },
      { id: "R5", name: `Remove from oven; fluff rice with fork; fold in ${s(27)}g butter and ${s(125)}g frozen peas; cover 2 min`, duration: 5, category: "cook", step: 4 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["M1"], `NIGHT BEFORE: ${j("M1").name}`);
    push([], `--- Day of cooking ---`);
    push(["P1", "P2", "P3"], `Korma prep: ${j("P1").name}. Mince garlic & ginger. Measure korma spices`);
    t += Math.max(j("P1").duration, j("P2").duration, j("P3").duration);
    push(["P4", "P5", "P6"], `Cashew paste & cream. Wash rice. Rice prep (onion, garlic, ginger, spices)`);
    t += Math.max(j("P4").duration, j("P5").duration, j("P6").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3", "C4"], `${j("C3").name}. ${j("C4").name}`);
    t += j("C3").duration + j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["P7", "C6"], `${j("P7").name}. Korma: ${j("C6").name}`);
    push(["R1"], `⭐ PARALLEL — Rice: ${j("R1").name}`);
    t += j("R1").duration;
    push(["R2"], `Rice: ${j("R2").name}`);
    t += Math.max(j("C6").duration - j("R1").duration, 0);
    push([], `⭐ Korma lid on; Rice sauté continues in parallel`);
    t += j("R2").duration;
    push(["R3"], `Rice: ${j("R3").name}`);
    t += j("R3").duration;
    push(["R4"], `Rice: add stock, into oven at 350°F`);
    push(["C7"], `Korma: ${j("C7").name}`);
    t += Math.max(j("R4").duration, j("C7").duration);
    push(["R5"], `Rice: ${j("R5").name}`);
    push(["C8"], `Korma: ${j("C8").name}`);
    t += Math.max(j("R5").duration, j("C8").duration);
    push([], "SERVE korma over pilau rice");
    return sched;
  },

  buildPrePrepSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note, phase) => { sched.push({ mins: t, tasks, note, phase }); };

    push(["M1"], `NIGHT BEFORE: ${j("M1").name}`, "prep");
    t += j("M1").duration;
    push([], "--- Day of cooking: prep ---", "prep");
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
    const prepEnd = t;
    push([], "ALL DAY-OF PREP DONE — delis loaded, ready to cook", "prep");

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
    push(["P7", "C6"], `${j("P7").name}. Korma: ${j("C6").name}`, "cook");
    push(["R1"], `PARALLEL — Rice: ${j("R1").name}`, "cook");
    t += j("R1").duration;
    push(["R2"], `Rice: ${j("R2").name}`, "cook");
    t += Math.max(j("C6").duration - j("R1").duration, 0) + j("R2").duration;
    push(["R3"], `Rice: ${j("R3").name}`, "cook");
    t += j("R3").duration;
    push(["R4"], `Rice: add stock, into oven at 350°F`, "cook");
    push(["C7"], `Korma: ${j("C7").name}`, "cook");
    t += Math.max(j("R4").duration, j("C7").duration);
    push(["R5"], `Rice: ${j("R5").name}`, "cook");
    push(["C8"], `Korma: ${j("C8").name}`, "cook");
    t += Math.max(j("R5").duration, j("C8").duration);
    push([], "SERVE korma over pilau rice", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      M1: [],
      P1: ["M1"], P2: [], P3: [], P4: [], P5: [], P6: [], P7: [],
      C1: ["P1", "P2", "P3", "P4", "M1"],
      C2: ["C1"], C3: ["C2"], C4: ["C3"],
      C5: ["C4", "M1"], C6: ["C5"],
      C7: ["C6"], C8: ["C7"],
      R1: ["P5", "P6"], R2: ["R1"], R3: ["R2", "P5"],
      R4: ["R3", "P7"], R5: ["R4"],
    },
    optimized: {
      M1: [],
      P1: ["M1"], P2: [], P3: [], P4: [], P5: [], P6: [], P7: [],
      C1: ["P1", "P2", "P3"],
      C2: ["C1"], C3: ["C2"], C4: ["C3"],
      C5: ["C4", "M1"], C6: ["C5"],
      C7: ["C6"], C8: ["C7"],
      R1: ["P5", "P6", "C5"], R2: ["R1"], R3: ["R2"],
      R4: ["R3", "P7"], R5: ["R4"],
    },
  },
};

export default recipe;
