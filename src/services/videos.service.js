import { google } from "googleapis";
import oauth2Client from "../config/googleClient.js";

export const fetchVideos = async (tokens, mappings) => {
  oauth2Client.setCredentials(tokens);
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });
  const allVideos = [];

  for (const m of mappings) {
    const resp = await youtube.playlistItems.list({
      part: "snippet,contentDetails",
      playlistId: m.uploadsId,
      maxResults: 50
    });

    const videoIds = (resp.data.items || []).map(v => v.contentDetails.videoId);
    if (videoIds.length === 0) continue;

    const videoDetails = await youtube.videos.list({
      part: "snippet,statistics",
      id: videoIds.join(',')
    });

    // Get unique channel IDs
    const channelIds = [...new Set(videoDetails.data.items.map(v => v.snippet.channelId))];
    
    // Fetch channel profile pictures
    const channelDetails = await youtube.channels.list({
      part: "snippet",
      id: channelIds.join(',')
    });

    // Map channelId -> profile picture URL
    const channelAvatars = {};
    (channelDetails.data.items || []).forEach(ch => {
      channelAvatars[ch.id] = ch.snippet.thumbnails.default.url;
    });

    const vids = (videoDetails.data.items || []).map(v => ({
      id: v.id,
      title: v.snippet.title,
      description: v.snippet.description,
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
      thumbnails: v.snippet.thumbnails,
      publishedAt: v.snippet.publishedAt,
      viewCount: parseInt(v.statistics.viewCount || 0),
      channelThumbnail: channelAvatars[v.snippet.channelId] || null
    }));

    allVideos.push(...vids);
    console.log('allVideos.length', allVideos?.length);
  }

  return allVideos;
};