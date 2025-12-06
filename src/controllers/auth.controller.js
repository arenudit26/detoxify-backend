import oauth2Client from "../config/googleClient.js";

const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"] ;


export const loginWithGoogle = (req,res)=>{

const url = oauth2Client.generateAuthUrl({
     access_type: "offline" ,
     scope:SCOPES ,
     prompt: "consent" 
}) 

res.redirect(url) ;
}

export const googleCallback=async(req,res)=>{
     console.log("googleCallback hit — query:", req.query);
     try{
        const code = req.query.code;

        if(!code){
        res.status(404).render("Code not received") ;
        }

        const {tokens} = await oauth2Client.getToken(code) ;
        console.log("got tokens") ;
        req.session.tokens = tokens;
        

        oauth2Client.setCredentials(tokens);

        return res.redirect("http://localhost:5173");

    }
     
     catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).send("Auth callback error");
  }
}










// export const googleCallback = async (req, res) => {
//   console.log("googleCallback hit - query:", req.query);
//   try {
//     const code = req.query.code;
//     if (!code) return res.status(400).send("No code received");

//     console.log("exchanging code for tokens...");

//     // small timeout wrapper so we can detect hang
//     const getTokenWithTimeout = (code, ms = 10000) => {
//       const p = oauth2Client.getToken(code);
//       const timeout = new Promise((_, rej) =>
//         setTimeout(() => rej(new Error("getToken timeout")), ms)
//       );
//       return Promise.race([p, timeout]);
//     };

//     const tokenResult = await getTokenWithTimeout(code, 10000);
//     const tokens = tokenResult.tokens || tokenResult; // some versions return {tokens}

//     console.log("got tokens keys:", Object.keys(tokens || {}));
//     console.log("has refresh_token?", !!tokens.refresh_token);

//     // persist tokens
//     req.session.tokens = tokens;
//     console.log("saved tokens to session");

//     // set credentials & redirect
//     oauth2Client.setCredentials(tokens);
//     console.log("redirecting to /");
//     return res.redirect("/");
//   } catch (err) {
//     console.error("OAuth callback error (detailed):", err?.response?.data || err.message || err);
//     // send a readable response so browser doesn't hang
//     return res.status(500).send("Auth callback error: " + (err.message || "unknown"));
//   }
// };



