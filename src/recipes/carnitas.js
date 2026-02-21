import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "carnitas",
  title: "Slow Cooker Pork Carnitas",
  source: "Damn Delicious",
  cuisine: "Mexican",
  image: "https://images.unsplash.com/premium_photo-1672976349009-918d041258aa?w=400&h=300&fit=crop",
  baseServings: 5,
  multiplierOptions: [1, 1.5, 2, 3, 4],
  servingsRange: [3, 20],
  notes: "Slow cooker: 8h low / 4-5h high, then broil for crisp. Prep: 15 mins.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const tortillaCount = si(20);
    return [
      { category: "Meat", items: [
        { name: "Pork shoulder (bone-in or boneless)", amount: `${s(1000)}g (${s(1)} kg)` },
      ]},
      { category: "Produce", items: [
        { name: "White onion (for slow cooker)", amount: `${sf(0.5)}` },
        { name: "Garlic cloves (for slow cooker)", amount: `${si(2)}` },
        { name: "White onion (for fixings)", amount: `${sf(0.5)}`, note: "Finely diced, to serve" },
        { name: "Radishes", amount: `${si(5)}`, note: "To serve" },
        { name: "Limes", amount: `${si(2)}`, note: "To serve + salsa" },
        { name: "Fresh coriander", amount: `${sf(1.5)} ${pl(Math.ceil(1.5 * mult), "sprig")}`, note: "Split: 1 sprig slow cooker, 0.5 salsa garnish" },
      ]},
      { category: "Salsa", items: [
        { name: "Plum tomatoes", amount: `${si(2)}` },
        { name: "Garlic clove (for salsa)", amount: `${si(1)}` },
        { name: "Red jalapeño", amount: `${sf(0.5)}` },
        { name: "White onion (for salsa)", amount: `${sf(0.5)}` },
      ]},
      { category: "Spices", items: [
        { name: "Dried oregano", amount: `${si(2)} tsp` },
        { name: "Chili powder", amount: `${si(1)} tbsp` },
        { name: "Ground cumin", amount: `${si(2)} tsp` },
        { name: "Black pepper", amount: `${si(1)} tsp` },
        { name: "Salt (rub)", amount: `${sf(1.5)} tsp` },
        { name: "Salt (salsa)", amount: `${sf(0.25)} tsp` },
      ]},
      { category: "Dairy", items: [
        { name: "Butter", amount: `${si(2)} tsp` },
        { name: "Whole milk", amount: `${s(125)}ml` },
      ]},
      { category: "Juice", items: [
        { name: "Orange juice", amount: `${s(125)}ml` },
      ]},
      { category: "Dry goods", items: [
        { name: "Corn tortillas", amount: `${tortillaCount}`, note: `~${si(4)} per person` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const slowCookTime = 480; // 8h low; note: 4-5h high

    return [
      { id: "P1", name: `Mix spice rub: ${sf(1.5)} tsp salt, ${si(1)} tbsp chili powder, ${si(2)} tsp cumin, ${si(2)} tsp oregano, ${si(1)} tsp black pepper`, duration: 3, category: "prep", step: 1 },
      { id: "P2", name: `Rub spice mix all over ${s(1000)}g pork shoulder; place in slow cooker`, duration: prepScale(4, mult), category: "prep", step: 1 },
      { id: "P3", name: `Roughly chop ${sf(0.5)} white onion and ${si(2)} garlic ${pl(si(2), "clove")}; scatter around pork`, duration: prepScale(3, mult), category: "prep", step: 1 },
      { id: "P4", name: `Pour ${s(125)}ml orange juice, ${s(125)}ml whole milk into slow cooker; add ${si(2)} tsp butter`, duration: 2, category: "prep", step: 1 },
      { id: "C1", name: `Slow cook on LOW 8h (or HIGH 4-5h)`, duration: slowCookTime, category: "cook", step: 2, note: "Do not lift lid during cooking" },
      { id: "C2", name: `Remove pork; shred on board with two forks, discarding large fat pieces`, duration: prepScale(10, mult), category: "cook", step: 3 },
      { id: "C3", name: `Return shredded pork to slow cooker juices; rest 30 min on KEEP WARM`, duration: 30, category: "cook", step: 3, note: "Absorbs juices" },
      { id: "P5", name: `Make salsa: chop ${si(2)} plum tomatoes; blend/mash with ${si(1)} garlic clove, ${sf(0.5)} red jalapeño, ${sf(0.25)} tsp salt, ${sf(0.5)} white onion, squeeze of lime, ${sf(0.5)} sprig coriander`, duration: prepScale(8, mult), category: "prep", step: 3 },
      { id: "P6", name: `Prep fixings: finely dice ${sf(0.5)} white onion, slice ${si(5)} radishes, halve ${si(2)} limes, pick remaining coriander leaves`, duration: prepScale(5, mult), category: "prep", step: 3 },
      { id: "C4", name: `Spread shredded pork in single layer on baking sheet; broil 5-7 min until edges crisp`, duration: mult > 2 ? 10 : 7, category: "cook", step: 4, note: mult > 2 ? "Work in batches under broiler" : "Watch closely — it crisps fast" },
      { id: "C5", name: `Warm ${si(20)} corn tortillas (dry pan or wrapped in foil in oven)`, duration: 5, category: "cook", step: 4 },
      { id: "C6", name: `Serve: crisp carnitas in tortillas, top with salsa, onion, radish, coriander, squeeze of lime`, duration: 3, category: "cook", step: 5 },
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
    push(["P3", "P4"], `${j("P3").name}. ${j("P4").name}`);
    t += Math.max(j("P3").duration, j("P4").duration);
    push(["C1"], `Start slow cooker — LOW 8h or HIGH 4-5h`);
    push([], `⭐ GAP: ${j("C1").duration} min slow cook — make salsa & prep fixings closer to end`);
    t += j("C1").duration;
    push(["P5"], `⭐ GAP (during C3 rest): ${j("P5").name}`);
    push(["P6"], `⭐ GAP (during C3 rest): ${j("P6").name}`);
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], `Return pork to juices; rest 30 min on KEEP WARM`);
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
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
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    const prepEnd = t;
    push([], "ALL PREP DONE — slow cooker loaded, ready to start", "prep");

    push(["C1"], `Start slow cooker — LOW 8h or HIGH 4-5h`, "cook");
    t += j("C1").duration;
    push(["P5"], j("P5").name, "cook");
    t += j("P5").duration;
    push(["P6"], j("P6").name, "cook");
    t += j("P6").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], `Return pork to juices; rest 30 min on KEEP WARM`, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], j("C6").name, "cook");
    t += j("C6").duration;
    push([], "SERVE", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: ["P1"], P3: [], P4: [],
      C1: ["P2", "P3", "P4"],
      C2: ["C1"], C3: ["C2"],
      P5: [], P6: [],
      C4: ["C3"], C5: [],
      C6: ["C4", "C5", "P5", "P6"],
    },
    optimized: {
      P1: [], P2: ["P1"], P3: [], P4: [],
      C1: ["P2", "P3", "P4"],
      C2: ["C1"], C3: ["C2"],
      P5: ["C2"], P6: ["C2"],
      C4: ["C3"], C5: ["C3"],
      C6: ["C4", "C5", "P5", "P6"],
    },
  },
};

export default recipe;
