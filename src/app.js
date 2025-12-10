import express from "express" ;
import cors from "cors" ;
import session from "express-session";
import authRoutes from "./routes/auth.routes.js" ;
import feedRoutes from "./routes/feed.routes.js"; 

// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({
  origin: "https://detoxifyproject-pak9svf1o-udit-arens-projects.vercel.app/",
  credentials: true,
}));


app.use(session({
 name: "detoxify.sid",
  secret: process.env.SESSION_SECRET || "dev_secret",
  resave: false,
  saveUninitialized: false,
  proxy: NODE_ENV === "production",
  cookie: {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000,   
  } 
}));

app.use("/auth",authRoutes) ;
app.use("/feed", feedRoutes) ;



app.get("/" , (req,res)=>{
    res.send("Detoxify backend running!") ;
}) ;


export default app;
