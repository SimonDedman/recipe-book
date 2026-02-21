import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "texas-chile",
  title: "Real Texas Chile Con Carne",
  source: "Serious Eats",
  baseServings: 6,
  multiplierOptions: [1, 1.5, 2, 3],
  servingsRange: [4, 18],
  notes: "Chunky beef chuck with whole dried chilies. No beans. Active: 45 min. Total: 3h. Best overnight.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    return [
      { category: "Meat", items: [
        { name: "Beef chuck (trimmed)", amount: `${s(4)} lb (${s(1800)}g)`, note: "Cut into thick steaks for searing, then chunk after" },
      ]},
      { category: "Dried Chilies", items: [
        { name: "Sweet dried chilies (Costeño, New Mexico, or Choricero)", amount: `${si(3)}` },
        { name: "Small hot dried chilies (Arbol or Cascabel)", amount: `${si(2)}` },
        { name: "Rich fruity dried chilies (Ancho, Mulato, or Pasilla)", amount: `${si(3)}` },
        { name: "Chipotles in adobo", amount: `${si(2)} chiles + ${si(2)} tbsp adobo sauce` },
      ]},
      { category: "Produce", items: [
        { name: "Large onion", amount: `${si(1)}, fine diced` },
        { name: "Garlic cloves", amount: `${si(4)}, grated` },
      ]},
      { category: "Liquid/Canned", items: [
        { name: "Chicken broth", amount: `${si(2)} quarts (${s(1900)}ml)` },
        { name: "Fish sauce", amount: `${si(2)} tbsp` },
        { name: "Apple cider vinegar", amount: `${si(2)} tbsp` },
        { name: "Hot sauce", amount: "To taste" },
      ]},
      { category: "Spices", items: [
        { name: "Ground cinnamon", amount: `${sf(0.5)} tsp` },
        { name: "Ground cumin", amount: `${si(1)} tbsp` },
        { name: "Ground allspice", amount: `${sf(0.25)} tsp` },
        { name: "Dried oregano", amount: `${si(2)} tsp` },
        { name: "Salt & black pepper", amount: "To taste" },
      ]},
      { category: "Dry goods", items: [
        { name: "Masa harina (or corn flour)", amount: `${si(2)}-${si(3)} tbsp`, note: "To thicken at end" },
        { name: "Vegetable oil", amount: `${si(2)} tbsp` },
      ]},
      { category: "Garnish (optional)", items: [
        { name: "Fresh cilantro", amount: "Small bunch" },
        { name: "White or yellow onion", amount: `${si(1)}, fine diced` },
        { name: "Scallions", amount: `${si(4)}`, note: "Sliced" },
        { name: "Shredded cheese", amount: "To taste" },
        { name: "Avocado", amount: `${si(1)}` },
        { name: "Flour or corn tortillas", amount: `${si(6)}` },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);

    return [
      { id: "P1", name: `Toast ${si(3)} sweet, ${si(2)} hot, and ${si(3)} fruity dried ${pl(si(8), "chili")} in dry pan or oven until fragrant; remove stems and seeds`, duration: prepScale(8, mult), category: "prep", step: 1 },
      { id: "P2", name: `Combine toasted chilies + ${si(2)} chipotles + ${si(2)} tbsp adobo + ${si(1)} quart (${s(950)}ml) chicken broth in pot; simmer 5 min until softened`, duration: 10, category: "cook", step: 1 },
      { id: "P3", name: `Blend chili-broth mixture in batches until completely smooth; strain if desired`, duration: prepScale(8, mult), category: "cook", step: 1, note: "Careful with hot liquid in blender — fill only halfway" },
      { id: "P4", name: `Trim and cut ${s(4)} lb (${s(1800)}g) beef chuck into thick steaks; season generously with salt and pepper`, duration: prepScale(8, mult), category: "prep", step: 2 },
      { id: "P5", name: `Fine dice ${si(1)} large onion`, duration: prepScale(4, mult), category: "prep", step: 2 },
      { id: "P6", name: `Grate ${si(4)} garlic ${pl(si(4), "clove")}`, duration: prepScale(2, mult), category: "prep", step: 2 },
      { id: "P7", name: `Measure spices: ${sf(0.5)} tsp cinnamon, ${si(1)} tbsp cumin, ${sf(0.25)} tsp allspice, ${si(2)} tsp oregano`, duration: 2, category: "prep", step: 2 },
      { id: "C1", name: `Heat ${si(2)} tbsp oil in Dutch oven over high heat until shimmering`, duration: 2, category: "cook", step: 2 },
      { id: "C2", name: `Sear beef steaks${mult > 1 ? " in batches" : ""}: 6 min first side, 4 min second side, until deep brown crust`, duration: cookScale(10, mult, "batch"), category: "cook", step: 2, note: mult > 1 ? "Do not crowd pan — work in batches" : "Do not crowd pan" },
      { id: "C3", name: `Transfer beef to board; when cool enough, cut into 1.5-2 inch chunks`, duration: 8, category: "cook", step: 2, note: "Beef will finish cooking in braise" },
      { id: "C4", name: `Reduce heat to medium; sauté diced onion 2 min until softened`, duration: 3, category: "cook", step: 3 },
      { id: "C5", name: `Add grated garlic and spices; stir constantly 1 min`, duration: 2, category: "cook", step: 3 },
      { id: "C6", name: `Add all beef chunks + chili purée + remaining ${si(1)} quart (${s(950)}ml) broth; stir to combine`, duration: 3, category: "cook", step: 3 },
      { id: "C7", name: `Bring to boil, reduce to low simmer; cook covered 2.5-3h, stirring every 30 min`, duration: 165, category: "cook", step: 3, note: "Beef should be fork-tender; skim fat as needed" },
      { id: "C8", name: `Stir in ${si(2)} tbsp fish sauce, ${si(2)}-${si(3)} tbsp masa; simmer uncovered 10 min to thicken`, duration: 12, category: "cook", step: 4 },
      { id: "C9", name: `Stir in ${si(2)} tbsp apple cider vinegar; taste and adjust salt, heat (hot sauce)`, duration: 3, category: "cook", step: 4, note: "Best if cooled and refrigerated overnight; reheat gently" },
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
    push(["P4", "P5", "P6", "P7"], `⭐ GAP: While chili purée simmers — ${j("P4").name.toLowerCase()}. ${j("P5").name.toLowerCase()}. ${j("P6").name.toLowerCase()}. ${j("P7").name.toLowerCase()}`);
    t += j("P3").duration;
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], "Transfer beef to board; cut into 1.5-2 inch chunks when cool enough");
    t += j("C3").duration;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], j("C5").name);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push(["C7"], `Bring to boil, cover, reduce to low simmer — ${j("C7").duration} min`);
    push([], `⭐ GAP: ${j("C7").duration} min unattended simmer — stir every 30 min`);
    t += j("C7").duration;
    push(["C8"], j("C8").name);
    t += j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push([], "SERVE with garnishes — or cool, refrigerate overnight for best flavour");
    return sched;
  },

  buildPrePrepSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note, phase) => { sched.push({ mins: t, tasks, note, phase }); };

    push(["P1"], j("P1").name, "prep");
    t += j("P1").duration;
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    push(["P5"], j("P5").name, "prep");
    t += j("P5").duration;
    push(["P6"], j("P6").name, "prep");
    t += j("P6").duration;
    push(["P7"], j("P7").name, "prep");
    t += j("P7").duration;
    const prepEnd = t;
    push([], "ALL PREP DONE — chilies toasted, beef prepped, aromatics diced, ready to cook", "prep");

    push(["P2"], j("P2").name, "cook");
    t += j("P2").duration;
    push(["P3"], j("P3").name, "cook");
    t += j("P3").duration;
    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], "Transfer beef to board; cut into 1.5-2 inch chunks when cool enough", "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], j("C5").name, "cook");
    t += j("C5").duration;
    push(["C6"], j("C6").name, "cook");
    t += j("C6").duration;
    push(["C7"], `Cover and simmer low ${j("C7").duration} min, stirring every 30 min`, "cook");
    t += j("C7").duration;
    push(["C8"], j("C8").name, "cook");
    t += j("C8").duration;
    push(["C9"], j("C9").name, "cook");
    t += j("C9").duration;
    push([], "SERVE with garnishes — or cool and refrigerate overnight", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [],
      P2: ["P1"],
      P3: ["P2"],
      P4: [], P5: [], P6: [], P7: [],
      C1: ["P3", "P4", "P5", "P6", "P7"],
      C2: ["C1", "P4"],
      C3: ["C2"],
      C4: ["C3", "P5"],
      C5: ["C4", "P6", "P7"],
      C6: ["C5", "P3"],
      C7: ["C6"],
      C8: ["C7"],
      C9: ["C8"],
    },
    optimized: {
      P1: [],
      P2: ["P1"],
      P3: ["P2"],
      P4: ["P1"], P5: ["P1"], P6: ["P1"], P7: ["P1"],
      C1: ["P3", "P4"],
      C2: ["C1"],
      C3: ["C2"],
      C4: ["C3", "P5"],
      C5: ["C4", "P6", "P7"],
      C6: ["C5", "P3"],
      C7: ["C6"],
      C8: ["C7"],
      C9: ["C8"],
    },
  },
};

export default recipe;
