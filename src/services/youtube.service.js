import { google } from "googleapis";
import oauth2Client from "../config/googleClient.js";


export const fetchSubscriptions = async(tokens)=>{
    oauth2Client.setCredentials(tokens) ;

const youtube = google.youtube({
    version: "v3",
    auth : oauth2Client 
})

const subs = await youtube.subscriptions.list({
    part: "snippet",
    mine: true
})
return subs.data.items ;

}


