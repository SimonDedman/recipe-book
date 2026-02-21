/**
 * Recipe Schema
 * =============
 * Each recipe exports an object with this shape:
 *
 * {
 *   id: string,              // URL-safe slug
 *   title: string,
 *   source: string,          // e.g. "Serious Eats, Daniel Gritzer"
 *   baseServings: number,    // servings at ×1
 *   multiplierOptions: number[],  // e.g. [1, 1.5, 2, 2.5, 3, 4]
 *   servingsRange: [min, max],    // for servings dropdown
 *   notes: string,           // top-level notes (e.g. "fits Dutch oven at ×1")
 *
 *   // Functions that take a multiplier and return scaled data:
 *   buildIngredients(mult) → [{ id, category, name, amount, unit, note? }]
 *   buildShoppingList(mult) → [{ category, items: [{ name, amount, note? }] }]
 *   buildJobs(mult) → [{ id, name, duration, category, step, note? }]
 *   buildOptimizedSchedule(jobs) → [{ mins, tasks, note }]
 *   buildPrePrepSchedule(jobs) → { schedule: [...], prepEnd: number }
 *   deps: { strict: {}, optimized: {} }
 * }
 */

// ── Shared helpers for recipe builders ──

/** Round to nice display numbers */
export function r(val, mult) {
  const v = val * mult;
  if (v >= 100) return Math.round(v / 5) * 5;
  if (v >= 10) return Math.round(v);
  return Math.round(v * 10) / 10;
}

/** Round to integer */
export function ri(val, mult) {
  return Math.round(val * mult);
}

/** Display as fraction */
export function frac(val, mult) {
  const v = val * mult;
  const fracs = { 0.25: "¼", 0.5: "½", 0.75: "¾", 0.125: "⅛", 0.33: "⅓", 0.67: "⅔" };
  const whole = Math.floor(v);
  const rem = Math.round((v - whole) * 100) / 100;
  if (rem === 0) return `${whole}`;
  const closest = Object.entries(fracs).reduce((best, [k, s]) =>
    Math.abs(parseFloat(k) - rem) < Math.abs(parseFloat(best[0]) - rem) ? [k, s] : best
  );
  if (whole === 0) return closest[1];
  return `${whole}${closest[1]}`;
}

/** Prep time scaling: sub-linear */
export function prepScale(baseMins, mult) {
  if (mult <= 1) return baseMins;
  return Math.round(baseMins * Math.pow(mult, 0.6));
}

/** Cook time scaling */
export function cookScale(baseMins, mult, scaleType = "fixed") {
  if (scaleType === "batch") return Math.round(baseMins * Math.pow(mult, 0.7));
  if (scaleType === "linear") return Math.round(baseMins * mult);
  return baseMins; // fixed
}

/** Format minutes as H:MM */
export function fmtTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

/** Format countdown */
export function fmtCountdown(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `T-${h}:${String(m).padStart(2, "0")}`;
}

/** Pluralize */
export function pl(count, singular, plural) {
  return count === 1 ? singular : (plural || singular + "s");
}
