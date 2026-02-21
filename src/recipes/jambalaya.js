import { r, ri, frac, prepScale, cookScale, pl } from "./schema.js";

const recipe = {
  id: "jambalaya",
  title: "Creole-Style Red Jambalaya w/ Chicken & Sausage",
  source: "Serious Eats, Daniel Gritzer",
  cuisine: "Cajun & Creole",
  image: "https://images.unsplash.com/premium_photo-1667807522175-bc48128e951e?w=400&h=300&fit=crop",
  baseServings: 8,
  multiplierOptions: [1, 1.5, 2, 2.5, 3, 3.5, 4],
  servingsRange: [4, 20],
  notes: "×1 fits Dutch oven perfectly & scales to 1 can tomatoes. Prep: 30 mins. Cook: 40 hob + 40 oven = 1h20.",

  buildShoppingList(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const cans = si(1);
    const sausagePacks = Math.ceil(1.5 * mult);
    const sausageCount = si(6);
    return [
      { category: "Meat", items: [
        { name: "Boneless skinless chicken thighs", amount: `${s(1.25)} lb (${s(565)}g)`, note: `Buy ${si(1)} slab, retain 3 thighs → ${Math.ceil(mult)} large ${pl(Math.ceil(mult), "ziploc")}` },
        { name: "Cajun/Creole sausage (andouille or chaurice)", amount: `${s(0.75)} lb (${s(340)}g)`, note: `${sausagePacks} ${pl(sausagePacks, "pack")}, ${sausageCount} sausages` },
      ]},
      { category: "Produce", items: [
        { name: "Yellow onions, medium", amount: `${si(2)} (${s(225)}g)` },
        { name: "Green bell peppers, medium", amount: `${si(2)} (${s(280)}g)`, note: "or sub 1-2 pasilla/other" },
        { name: "Celery ribs", amount: `${si(4)} (${s(170)}g)` },
        { name: "Garlic cloves", amount: `${si(4)} medium` },
        { name: "Scallions", amount: `${si(18)}` },
        { name: "Fresh thyme", amount: `${si(2)} tsp minced`, note: `or ${si(1)} tsp dried` },
      ]},
      { category: "Canned/Jarred", items: [
        { name: "Peeled whole tomatoes (28 oz / 795g can)", amount: `${cans} ${pl(cans, "can")}` },
        { name: "Low-sodium chicken stock/broth", amount: `${si(3)} cups (${s(720)}ml)`, note: "Plus extra if needed" },
        { name: "Tomato paste", amount: `${si(1)} tsp (${s(5)}ml)` },
        { name: "Louisiana-style hot sauce", amount: `${si(1)} tbsp (${s(15)}ml)`, note: "Plus more for serving" },
      ]},
      { category: "Dry goods", items: [
        { name: "Long-grain rice", amount: `${si(2)} cups (${s(370)}g)` },
        { name: "Vegetable/canola oil", amount: `${si(1)} tbsp (${s(15)}ml)`, note: "Plus more if needed" },
      ]},
      { category: "Spices", items: [
        { name: "Dried oregano", amount: `${si(1)} tsp` },
        { name: "Cayenne pepper", amount: `${sf(0.25)} tsp` },
        { name: "Garlic powder", amount: `${sf(0.25)} tsp` },
        { name: "Bay leaves", amount: `${si(2)}` },
        { name: "Salt", amount: "To taste" },
        { name: "Black pepper", amount: "Generous" },
      ]},
      { category: "Equipment/Supplies", items: [
        { name: "Large ziploc bags", amount: `${Math.ceil(mult)}` },
        { name: "Large delis", amount: `${si(5) + Math.max(0, si(1) - 1)}+` },
        { name: "Medium deli", amount: `${mult <= 1 ? 2 : mult <= 2 ? 1 : 0}`, note: mult > 2 ? "Use large delis for all" : "" },
      ]},
    ];
  },

  buildJobs(mult) {
    const s = (v) => r(v, mult);
    const si = (v) => ri(v, mult);
    const sf = (v) => frac(v, mult);
    const cans = si(1);

    return [
      { id: "P1", name: `Strain & crush ${cans} ${pl(cans, "can")} (${s(795)}g) whole tomatoes; juice→${cans > 1 ? cans + " large delis" : "large deli"}, crushed→large deli`, duration: prepScale(5, mult), category: "prep", step: 1 },
      { id: "P2", name: `Combine tomato juice + stock to ${si(4)} cups (${s(960)}ml) in ${cans > 1 ? cans + " large delis" : "large deli"} + ${si(2)} bay leaves`, duration: 2, category: "prep", step: 1 },
      { id: "P3", name: `Preheat oven to 325°F (160°C)`, duration: 1, category: "prep", step: 2, note: "~15 min to heat" },
      { id: "P4", name: `Season ${s(1.25)} lb (${s(565)}g) chicken w/ salt & pepper`, duration: prepScale(2, mult), category: "prep", step: 2 },
      { id: "P5", name: `Slice ${s(0.75)} lb (${s(340)}g) sausage into thin rounds`, duration: prepScale(4, mult), category: "prep", step: 3 },
      { id: "P6", name: `Dice ${si(2)} ${pl(si(2), "onion")} (${s(225)}g)`, duration: prepScale(3, mult), category: "prep", step: 3 },
      { id: "P7", name: `Stem, deseed & dice ${si(2)} bell ${pl(si(2), "pepper")} (${s(280)}g)`, duration: prepScale(4, mult), category: "prep", step: 3 },
      { id: "P8", name: `Dice ${si(4)} celery ${pl(si(4), "rib")} (${s(170)}g)`, duration: prepScale(3, mult), category: "prep", step: 3 },
      { id: "P9", name: `Mince ${si(4)} garlic ${pl(si(4), "clove")}`, duration: prepScale(2, mult), category: "prep", step: 3 },
      { id: "P10", name: `Measure spices: ${si(1)} tbsp (${s(15)}ml) hot sauce, ${si(2)} tsp thyme, ${si(1)} tsp oregano, ${sf(0.25)} tsp cayenne, ${sf(0.25)} tsp garlic pwd, pepper`, duration: 3, category: "prep", step: 4 },
      { id: "P11", name: `Slice ${si(18)} scallions`, duration: prepScale(3, mult), category: "prep", step: 6 },
      { id: "P12", name: `Measure ${si(2)} cups (${s(370)}g) rice`, duration: 1, category: "prep", step: 5 },
      { id: "C1", name: `Heat ${si(1)} tbsp (${s(15)}ml) oil until shimmering`, duration: 3, category: "cook", step: 2 },
      { id: "C2", name: `Brown ${s(1.25)} lb (${s(565)}g) chicken${mult > 1 ? " in batches" : ""}, 6 min/side`, duration: cookScale(12, mult, "batch"), category: "cook", step: 2, note: mult > 1 ? "Batches needed" : "" },
      { id: "C3", name: `Rest chicken 5 min, dice into ½-inch chunks`, duration: 7, category: "cook", step: 2 },
      { id: "C4", name: `Brown ${s(0.75)} lb (${s(340)}g) sliced sausage`, duration: cookScale(3, mult, mult > 2 ? "batch" : "fixed"), category: "cook", step: 3 },
      { id: "C5", name: `Sauté ${s(225)}g onion, ${s(280)}g pepper, ${s(170)}g celery, ${si(4)} ${pl(si(4), "clove")} garlic`, duration: 8, category: "cook", step: 3 },
      { id: "C6", name: `Cook ${si(1)} tsp (${s(5)}ml) tomato paste until browned`, duration: 1, category: "cook", step: 4 },
      { id: "C7", name: `Add spices, crushed tomatoes, ${si(4)} cups stock mix, chicken, ${si(2)} bay leaves → simmer`, duration: 3, category: "cook", step: 4 },
      { id: "C8", name: `Season w/ salt, taste`, duration: 2, category: "cook", step: 4 },
      { id: "C9", name: `Stir in ${si(2)} cups (${s(370)}g) rice, return to simmer`, duration: 3, category: "cook", step: 5 },
      { id: "C10", name: `Bake in oven at 325°F (160°C)`, duration: mult > 2 ? 50 : 45, category: "cook", step: 5, note: mult > 2 ? "Larger volume, check at 40m" : "40 min + check" },
      { id: "C11", name: `Stir in ${si(18)} sliced scallions`, duration: 1, category: "cook", step: 6 },
      { id: "C12", name: `Rest 15 min covered`, duration: 15, category: "cook", step: 6 },
    ];
  },

  buildOptimizedSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note) => { sched.push({ mins: t, tasks, note }); };

    push(["P3", "P1"], `Turn on oven. ${j("P1").name.split(";")[0]}`);
    t += j("P1").duration;
    push(["P2"], j("P2").name);
    t += j("P2").duration;
    push(["P4", "P5"], `${j("P4").name}. ${j("P5").name}`);
    t += Math.max(j("P4").duration, j("P5").duration);
    push(["C1"], j("C1").name);
    t += j("C1").duration;
    push(["C2"], j("C2").name);
    t += j("C2").duration;
    push(["C3"], "Remove chicken to board, rest 5 min");
    push(["P6", "P7", "P8", "P9"], `⭐ GAP: ${j("P6").name}, ${j("P7").name.toLowerCase()}, ${j("P8").name.toLowerCase()}, ${j("P9").name.toLowerCase()} — while chicken rests`);
    t += 5;
    push(["C3"], "Dice rested chicken into ½-inch chunks");
    t += 2;
    push(["C4"], j("C4").name);
    t += j("C4").duration;
    push(["C5"], `${j("C5").name} (8 min)`);
    push(["P10"], `⭐ GAP: ${j("P10").name}`);
    t += j("C5").duration;
    push(["C6"], j("C6").name);
    t += j("C6").duration;
    push(["C7", "C8"], `${j("C7").name.replace(" →", ".")} Season w/ salt`);
    t += j("C7").duration + j("C8").duration;
    push(["C9"], j("C9").name);
    t += j("C9").duration;
    push(["C10"], "Lid on, into oven");
    push(["P11"], `⭐ GAP: ${j("P11").name} during oven bake`);
    t += j("C10").duration;
    push(["C11"], j("C11").name);
    t += j("C11").duration;
    push(["C12"], `Rest ${j("C12").duration} min covered`);
    t += j("C12").duration;
    push([], "🍽️ SERVE with hot sauce");
    return sched;
  },

  buildPrePrepSchedule(jobs) {
    const j = (id) => jobs.find((x) => x.id === id);
    let t = 0;
    const sched = [];
    const push = (tasks, note, phase) => { sched.push({ mins: t, tasks, note, phase }); };

    push(["P1"], j("P1").name.split(";")[0], "prep");
    t += j("P1").duration;
    push(["P2"], j("P2").name, "prep");
    t += j("P2").duration;
    push(["P6"], j("P6").name, "prep");
    t += j("P6").duration;
    push(["P7"], j("P7").name, "prep");
    t += j("P7").duration;
    push(["P8"], j("P8").name, "prep");
    t += j("P8").duration;
    push(["P9"], j("P9").name, "prep");
    t += j("P9").duration;
    push(["P5"], j("P5").name, "prep");
    t += j("P5").duration;
    push(["P4"], j("P4").name, "prep");
    t += j("P4").duration;
    push(["P10"], `${j("P10").name} into large deli`, "prep");
    t += j("P10").duration;
    push(["P12"], `${j("P12").name} into large deli`, "prep");
    t += j("P12").duration;
    push(["P11"], `${j("P11").name} into med deli`, "prep");
    t += j("P11").duration;
    const prepEnd = t;
    push([], "✅ ALL PREP DONE — Clean up, delis loaded, ready to cook", "prep");

    push(["P3"], j("P3").name, "cook");
    t += j("P3").duration;
    push(["C1"], j("C1").name, "cook");
    t += j("C1").duration;
    push(["C2"], j("C2").name, "cook");
    t += j("C2").duration;
    push(["C3"], `Rest chicken 5 min, dice into ½-inch chunks`, "cook");
    t += j("C3").duration;
    push(["C4"], j("C4").name, "cook");
    t += j("C4").duration;
    push(["C5"], `${j("C5").name} (8 min)`, "cook");
    t += j("C5").duration;
    push(["C6"], j("C6").name, "cook");
    t += j("C6").duration;
    push(["C7", "C8"], `${j("C7").name.replace(" →", ".")} Season w/ salt`, "cook");
    t += j("C7").duration + j("C8").duration;
    push(["C9"], j("C9").name, "cook");
    t += j("C9").duration;
    push(["C10"], "Lid on, into oven", "cook");
    t += j("C10").duration;
    push(["C11"], j("C11").name, "cook");
    t += j("C11").duration;
    push(["C12"], `Rest ${j("C12").duration} min covered`, "cook");
    t += j("C12").duration;
    push([], "🍽️ SERVE with hot sauce", "cook");

    return { schedule: sched, prepEnd };
  },

  deps: {
    strict: {
      P1: [], P2: ["P1"], P3: [], P4: [],
      P5: [], P6: [], P7: [], P8: [], P9: [], P10: [], P11: [], P12: [],
      C1: ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10"],
      C2: ["C1", "P4"], C3: ["C2"],
      C4: ["C3", "P5"], C5: ["C4", "P6", "P7", "P8", "P9"],
      C6: ["C5"], C7: ["C6", "P10", "P2", "P1"],
      C8: ["C7"], C9: ["C8", "P12"], C10: ["C9", "P3"],
      C11: ["C10", "P11"], C12: ["C11"],
    },
    optimized: {
      P1: [], P2: ["P1"], P3: [], P4: [],
      P5: [], P6: [], P7: [], P8: [], P9: [], P10: [], P11: [], P12: [],
      C1: ["P1", "P2", "P4"], C2: ["C1"], C3: ["C2"],
      C4: ["C3", "P5"], C5: ["C4", "P6", "P7", "P8", "P9"],
      C6: ["C5"], C7: ["C6", "P10", "P2"],
      C8: ["C7"], C9: ["C8", "P12"], C10: ["C9", "P3"],
      C11: ["C10", "P11"], C12: ["C11"],
    },
  },
};

export default recipe;
