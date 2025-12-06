import { fetchSubscriptions } from "../services/youtube.service.js";
import { mapChannelsToUploads } from "../services/mapping.service.js";
import { fetchVideos } from "../services/videos.service.js";
import * as filterService from "../services/filter.service.js";

export const getFeed = async (req, res) => {
  console.log("🔥 SERVER: /feed called, req.query =", req.query);
  const category = req.query.category || "none";
  
  try {
    const tokens = req.session.tokens;
    if (!tokens) return res.status(401).json({ error: "Login required" });
  
    const subs = await fetchSubscriptions(tokens);
    const mappings = await mapChannelsToUploads(tokens, subs);
    const allVideos = await fetchVideos(tokens, mappings);

const limit = Number(req.query.limit) || 200;

const scored = filterService.filterVideos(allVideos, category, { minScore: 0 });
scored.sort((a,b) => b.score - a.score || new Date(b.publishedAt) - new Date(a.publishedAt));

return res.json({ count: scored.length, results: scored.slice(0, limit) });


  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Feed error", details: err.message });
  }
};
