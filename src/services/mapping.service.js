import { google } from "googleapis";
import oauth2Client from "../config/googleClient.js";

export const mapChannelsToUploads = async (tokens, subs) => {
  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  const channelIds = subs
    .map(s => s.snippet?.resourceId?.channelId)
    .filter(Boolean);

  const unique = [...new Set(channelIds)];
  const idString = unique.join(",");

  const resp = await youtube.channels.list({
    part: "contentDetails",
    id: idString
  });

  return resp.data.items.map(ch => ({
    channelId: ch.id,
    uploadsId: ch.contentDetails.relatedPlaylists.uploads
  }));
};











































// import { getSubscriptions } from "./youtube.service.js";

// export const getUploadsPlaylistId=async(req,res)=>{
//     try{
//         const subs = getSubscriptions();
       
// subs.data.items.forEach(item => {
// const channelId = item.snippet?.resourceId?.channelId;
//   if (channelId) result.push(channelId);
// });

// const channelIds = Array.from(new Set(result));
// if (channelIds.length === 0) 
//     return res.json({ mapped: 0, mappings: [] });

//         const idString = channelIds.join(",");
         
//       const response = await youtube.channels.list({
//    part: "contentDetails",
//    id: idString 
// })

// const mappings = (response.data.items || []).map(it => ({
//   channelId: it.id,
//   uploadsId: it.contentDetails?.relatedPlaylists?.uploads || null
// }));

// return mappings ;

//  }

//     catch(err){
//         console.log("an error found:",err);
//         return res.status(500).json({ error: "Failed to fetch uploadPlaylistids", details: err.message });
//     }
    
// }
