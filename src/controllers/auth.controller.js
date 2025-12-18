// controllers/auth.controller.js
import { google } from "googleapis";

// Helper to create OAuth2 client on demand
function createOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH_REDIRECT_URI ;

  // if (!clientId || !clientSecret || !redirectUri) {
  //   const missing = [
  //     !clientId && "GOOGLE_CLIENT_ID",
  //     !clientSecret && "GOOGLE_CLIENT_SECRET",
  //     !redirectUri && "(OAUTH_REDIRECT_URI)"
  //   ].filter(Boolean);
  //   const msg = `Missing env vars: ${missing.join(", ")}`;
  //   const e = new Error(msg);
  //   e.missingEnv = true;
  //   throw e;
  // }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ;

export const loginWithGoogle = (req, res) => {
  try {
    const oauth2Client = createOAuthClient();

    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid"
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes
    });

    return res.redirect(url);
  } catch (err) {
    console.log(err) ;
    // console.error("loginWithGoogle error:", err && (err.missingEnv ? err.message : err.stack || err));
  //   // If missing env, return a helpful message so you can see it in logs & browser
  //   if (err && err.missingEnv) {
  //     return res.status(500).send(`OAuth config error: ${err.message}`);
  //   }
  //   return res.status(500).send("Internal Server Error");
  // }
};

export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      console.warn("googleCallback called without code, query:", req.query);
      return res.status(400).send("No code returned from Google");
    }

    const oauth2Client = createOAuthClient();

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code).catch(err => {
      console.error("getToken error:", err && (err.stack || err));
      throw new Error("Failed to exchange code for tokens");
    });

    if (!tokens) {
      console.error("No tokens received from Google:", tokens);
      return res.status(500).send("Token exchange failed");
    }

    // Persist tokens in session (ensure session middleware exists)
    if (!req.session) {
      console.error("No session middleware: req.session is undefined");
      return res.status(500).send("Session not configured");
    }
    req.session.tokens = tokens;

    // Set credentials on client and fetch userinfo
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
    const { data: profile } = await oauth2.userinfo.get().catch(err => {
      console.error("userinfo.get error:", err && (err.stack || err));
      return { data: null };
    });

    if (profile) {
      req.session.user = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        picture: profile.picture
      };
    }

    // Redirect back to frontend (adjust path as needed)
    return res.redirect(`${FRONTEND_ORIGIN}/dashboard`);
  } catch (err) {
    // If it's our missing-env error, it has a helpful message
    console.error("googleCallback error:", err && (err.message || err.stack || err));
    if (err && err.missingEnv) {
      return res.status(500).send(`OAuth config error: ${err.message}`);
    }
    return res.status(500).send("Authentication failed");
  }
};





// // controllers/auth.controller.js
// import { google } from "googleapis";

// const clientId = process.env.GOOGLE_CLIENT_ID;
// const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
// const redirectUri = process.env.OAUTH_REDIRECT_URI; // must equal the URI in Google Console
// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

// export const loginWithGoogle = (req, res) => {
//   const scopes = [
//     "https://www.googleapis.com/auth/userinfo.profile",
//     "https://www.googleapis.com/auth/userinfo.email"
//   ];
//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent",
//     scope: scopes,
//   });
//   // redirect user to Google's consent screen
//   res.redirect(url);
// };

// export const googleCallback = async (req, res) => {
//   const code = req.query.code;
//   if (!code) {
//     return res.status(400).send("No code returned from Google");
//   }

//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     // tokens contains access_token, refresh_token (if available), expiry_date
//     req.session.tokens = tokens; // persist tokens in session
//     // Optionally fetch user info
//     const oauth2 = google.oauth2({ auth: oauth2Client.setCredentials(tokens), version: "v2" });
//     const { data: profile } = await oauth2.userinfo.get();

//     // store user minimal info in session if you want
//     req.session.user = {
//       id: profile.id,
//       email: profile.email,
//       name: profile.name,
//       picture: profile.picture
//     };

//     // Redirect back to frontend
//     return res.redirect(`${FRONTEND_ORIGIN}/dashboard`); // adjust path as needed
//   } catch (err) {
//     console.error("Google callback error:", err);
//     return res.status(500).send("Authentication failed");
//   }
// };







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













