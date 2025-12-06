import express from "express" ;
import { getFeed } from "../controllers/feed.controller.js";


const router = express.Router();
router.get("/",getFeed) ;


export default router ;
