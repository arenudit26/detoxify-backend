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

        return res.redirect("https://detoxify-frontend.onrender.com");

    }
     
     catch (err) {
    console.error("OAuth callback error:", err);
    return res.status(500).send("Auth callback error");
  }
}













