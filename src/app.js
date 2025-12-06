import express from "express" ;
import cors from "cors" ;
import session from "express-session";
import authRoutes from "./routes/auth.routes.js" ;
import feedRoutes from "./routes/feed.routes.js"; 

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));


app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret",
  resave: false,
  saveUninitialized: true,
   cookie: {
    httpOnly: true,
    secure: false,                   // false for localhost; true in prod with HTTPS
    sameSite: "lax",                 // or 'none' if cross-site and required (see note)
    maxAge: 24 * 60 * 60 * 1000,     // 1 day
  } 
}));

app.use("/auth",authRoutes) ;
app.use("/feed", feedRoutes) ;



app.get("/" , (req,res)=>{
    res.send("Detoxify backend running!") ;
}) ;


export default app;
