// controllers/auth.controller.js
import { google } from "googleapis";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = process.env.OAUTH_REDIRECT_URI; // must equal the URI in Google Console
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

export const loginWithGoogle = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  // redirect user to Google's consent screen
  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code returned from Google");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    // tokens contains access_token, refresh_token (if available), expiry_date
    req.session.tokens = tokens; // persist tokens in session
    // Optionally fetch user info
    const oauth2 = google.oauth2({ auth: oauth2Client.setCredentials(tokens), version: "v2" });
    const { data: profile } = await oauth2.userinfo.get();

    // store user minimal info in session if you want
    req.session.user = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture
    };

    // Redirect back to frontend
    return res.redirect(`${FRONTEND_ORIGIN}/dashboard`); // adjust path as needed
  } catch (err) {
    console.error("Google callback error:", err);
    return res.status(500).send("Authentication failed");
  }
};







// import oauth2Client from "../config/googleClient.js";

// const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"] ;


// export const loginWithGoogle = (req,res)=>{

// const url = oauth2Client.generateAuthUrl({
//      access_type: "offline" ,
//      scope:SCOPES ,
//      prompt: "consent" 
// }) 

// res.redirect(url) ;
// }

// export const googleCallback=async(req,res)=>{
//      console.log("googleCallback hit — query:", req.query);
//      try{
//         const code = req.query.code;

//         if(!code){
//         res.status(404).render("Code not received") ;
//         }

//         const {tokens} = await oauth2Client.getToken(code) ;
//         console.log("got tokens") ;
//         req.session.tokens = tokens;
        

//         oauth2Client.setCredentials(tokens);

//         return res.redirect("https://detoxify-frontend.onrender.com");

//     }
     
//      catch (err) {
//     console.error("OAuth callback error:", err);
//     return res.status(500).send("Auth callback error");
//   }
// }













