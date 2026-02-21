import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "fideos",
  title: "Campfire Fideos, Chicken & Chorizo",
  source: "Amalgamation of paella/fideos recipes, adapted for pre-prep",
  cuisine: "Spanish",
  image: "https://images.unsplash.com/premium_photo-1675707499311-726434ce10fc?w=400&h=300&fit=crop",
  baseServings: 4,
  multiplierOptions: [1, 1.5, 2, 3, 4, 5],
  servingsRange: [2, 23],
  notes: "Multi-component pre-prep dish: aïoli, sofrito, fideos, meats, stock mix. Works on grill, outdoor BBQ, or stovetop.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const chickenThighs = ri(6, mult);
    return [
      { category: "Meat", items: [
        { name: "Chicken thighs, boneless", amount: `${chickenThighs} (${sf(1.5)} per person)`, note: "Cut into 1.5cm cubes" },
        { name: "Chorizo", amount: `${si(12)}cm`, note: "Cubed" },
      ]},
      { category: "Produce", items: [
        { name: "White onion", amount: `${sf(0.25)} whole, fine diced` },
        { name: "Red bell pepper", amount: `${sf(0.5)} pepper, fine diced` },
        { name: "Garlic cloves", amount: `${si(4)}`, note: `${si(3)} for oil/wine, ~${sf(0.67)} clove minced for sofrito` },
        { name: "Green onions / scallions", amount: `${si(9)} spears` },
        { name: "Orange", amount: `${si(1)}`, note: "Zest only" },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Chopped tomatoes", amount: `${s(59)}ml` },
        { name: "Sliced olives", amount: `${si(10)}` },
      ]},
      { category: "Dairy / Refrigerated", items: [
        { name: "Large egg", amount: `${si(1)}` },
        { name: "Egg yolk", amount: `${si(1)}` },
      ]},
      { category: "Dry goods / Pasta", items: [
        { name: "Fideos pasta", amount: `${s(400)}g` },
        { name: "Chicken stock powder", amount: `${sf(0.625)} tbsp` },
      ]},
      { category: "Oils & Vinegars", items: [
        { name: "EVOO", amount: `${s(139)}ml total`, note: `Sofrito ${s(30)}ml, toasting ${s(79)}ml, oil/wine mix ${s(15)}ml, aïoli ${s(15)}ml` },
        { name: "Vegetable oil", amount: `${s(118)}ml`, note: "For aïoli" },
        { name: "Champagne or white wine vinegar", amount: `${sf(1.25)} tsp` },
        { name: "White wine", amount: `${s(59)}ml` },
      ]},
      { category: "Spices & Condiments", items: [
        { name: "Saffron threads", amount: `${sf(0.5)} tsp (divided: aïoli + stock)` },
        { name: "Dijon mustard", amount: `${sf(0.75)} tsp` },
        { name: "Smoked Spanish paprika", amount: `${sf(0.125)} tsp (sofrito) + extra for chicken` },
        { name: "Tomato paste", amount: `${si(1)} tsp` },
        { name: "Dill", amount: "Pinch, for chicken seasoning" },
        { name: "White pepper", amount: "Pinch, for chicken seasoning" },
        { name: "Onion powder", amount: "Pinch, for chicken seasoning" },
        { name: "Chili powder", amount: "Pinch, for chicken seasoning" },
        { name: "Oregano / Italian herbs", amount: "To taste, for stock" },
        { name: "Cayenne pepper", amount: "Pinch, for stock" },
        { name: "Bay leaf", amount: `${si(1)}` },
        { name: "Salt", amount: "To taste" },
        { name: "Black pepper", amount: "To taste" },
      ]},
      { category: "Equipment/Supplies", items: [
        { name: "Large deli containers", amount: `${si(6)}+`, note: "One per sub-component" },
        { name: "Zip-lock bags", amount: `${si(1)}`, note: "For toasted fideos" },
        { name: "Small jar or deli", amount: `${si(1)}`, note: "For aïoli" },
        { name: "Cast iron skillet", amount: "1", note: "For toasting fideos" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const chickenThighs = ri(6, mult);

    return [
      // PRE-PREP: Aïoli
      { id: "P1", name: `Blend aïoli: ${sf(0.5)} tsp saffron, ${si(1)} egg, ${si(1)} yolk, ${si(1)} garlic clove, ${sf(1.25)} tsp champagne vinegar, ${sf(0.75)} tsp Dijon, ${sf(0.5)} tsp salt, ${s(118)}ml veg oil, ${s(15)}ml EVOO → jar, fridge`, duration: prepScale(5, mult), category: "prep", step: 1 },
      // PRE-PREP: Sofrito
      { id: "P2", name: `Fine dice ${sf(0.25)} onion, ${sf(0.5)} red pepper`, duration: prepScale(5, mult), category: "prep", step: 2 },
      { id: "P3", name: `Cook sofrito: ${s(30)}ml EVOO, diced onion & pepper, ${s(59)}ml chopped tomatoes, ${sf(0.67)} clove minced garlic, ${si(1)} tsp tomato paste, ${sf(0.125)} tsp smoked paprika, pinch salt — skillet 12 min → deli, fridge`, duration: prepScale(15, mult), category: "prep", step: 2 },
      // PRE-PREP: Fideos
      { id: "P4", name: `Toast ${s(400)}g fideos in ${s(79)}ml EVOO in cast iron until golden, 2-3 min; cool → bag`, duration: prepScale(6, mult), category: "prep", step: 3 },
      // PRE-PREP: Meats
      { id: "P5", name: `Cube ${chickenThighs} chicken thighs into 1.5cm pieces; season with dill, white pepper, onion powder, paprika, chili powder → deli, fridge`, duration: prepScale(8, mult), category: "prep", step: 4 },
      { id: "P6", name: `Cube ${si(12)}cm chorizo → deli, fridge`, duration: prepScale(3, mult), category: "prep", step: 4 },
      // PRE-PREP: Oil Wine Garlic
      { id: "P7", name: `Combine ${s(59)}ml white wine, ${s(15)}ml EVOO, ${si(3)} minced garlic cloves → deli, fridge`, duration: prepScale(3, mult), category: "prep", step: 5 },
      // PRE-PREP: Stock Mix
      { id: "P8", name: `Prepare stock mix: ${s(591)}ml boiling water, ${sf(0.625)} tbsp chicken stock powder, ${si(10)} sliced olives, oregano/Italian herbs, zest of ${si(1)} orange, salt, pepper, cayenne, pinch saffron, ${si(9)} green onion spears, ${si(1)} bay leaf → large deli`, duration: prepScale(5, mult), category: "prep", step: 6 },

      // COOK: Assembly
      { id: "C1", name: `Heat oil in large pan/paella pan over high heat (grill/BBQ/stovetop)`, duration: 2, category: "cook", step: 1 },
      { id: "C2", name: `Fry ${si(12)}cm cubed chorizo until edges crisp, 2-5 min`, duration: cookScale(4, mult, "fixed"), category: "cook", step: 2 },
      { id: "C3", name: `Add seasoned chicken pieces; cook 2-3 min, stirring`, duration: cookScale(3, mult, "fixed"), category: "cook", step: 3 },
      { id: "C4", name: `Add oil/wine/garlic mix; cook 1.5 min`, duration: 2, category: "cook", step: 4 },
      { id: "C5", name: `Add sofrito; stir to coat meats`, duration: 2, category: "cook", step: 5 },
      { id: "C6", name: `Add toasted fideos; stir to combine`, duration: 2, category: "cook", step: 6 },
      { id: "C7", name: `Pour in stock mix; spread evenly; cook 10-15 min until liquid absorbed and fideos tender`, duration: mult > 2 ? 15 : 12, category: "cook", step: 7, note: "Do not stir once stock added — let crust form on bottom" },
      { id: "C8", name: `Serve from pan with aïoli on the side`, duration: 2, category: "cook", step: 8 },
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
    t += j("P3").duration;
    push(["P4"], j("P4").name);
    t += j("P4").duration;
    push(["P5", "P6"], `${j("P5").name}. ${j("P6").name}`);
    t += Math.max(j("P5").duration, j("P6").duration);
    push(["P7", "P8"], `${j("P7").name}. ${j("P8").name}`);
    t += Math.max(j("P7").duration, j("P8").duration);
    push([], "✅ ALL PRE-PREP DONE — refrigerate all components until cook time");
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
    push([], "🍽️ SERVE with aïoli");
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
    push(["P8"], j("P8").name, "prep");
    t += j("P8").duration;
    const prepEnd = t;
    push([], "✅ ALL PREP DONE — 6 delis in fridge, fideos bagged, aïoli jarred", "prep");

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
    push([], "🍽️ SERVE with aïoli", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: [], P3: ["P2"], P4: [], P5: [], P6: [], P7: [], P8: [],
      C1: ["P1", "P3", "P4", "P5", "P6", "P7", "P8"],
      C2: ["C1", "P6"], C3: ["C2", "P5"],
      C4: ["C3", "P7"], C5: ["C4", "P3"],
      C6: ["C5", "P4"], C7: ["C6", "P8"],
      C8: ["C7"],
    },
    optimized: {
      P1: [], P2: [], P3: ["P2"], P4: [], P5: [], P6: [], P7: [], P8: [],
      C1: [],
      C2: ["C1", "P6"], C3: ["C2", "P5"],
      C4: ["C3", "P7"], C5: ["C4", "P3"],
      C6: ["C5", "P4"], C7: ["C6", "P8"],
      C8: ["C7"],
    },
  },
};

export default recipe;
