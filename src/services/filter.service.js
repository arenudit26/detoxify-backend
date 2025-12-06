import { Categories } from "../config/categories.js";

export function getKeywordsForCategory(category) {
  if (!category) return [];
  const key = String(category).toLowerCase();
  const arr = Categories[key] || [];
  return Array.isArray(arr) ? arr.map(t => String(t).toLowerCase()) : [];
}

export function filterVideos(allVideos = [], categoryOrTags, options = {}) {
  const { minScore = 0 } = options;

  const tags = Array.isArray(categoryOrTags)
    ? categoryOrTags.map(t => String(t).toLowerCase())
    : getKeywordsForCategory(categoryOrTags);
    console.log(tags) ;

  return (allVideos || []).map(v => {
    let score = 0;
    const title = String(v.title || "").toLowerCase();
    const desc = String(v.description || "").toLowerCase();
    

    if (tags.some(t => title.includes(t))) score += 2;
    if (tags.some(t => desc.includes(t))) score += 2;
     

   
    return { ...v, score };
  })
  .filter(v => v.score > minScore);
}
