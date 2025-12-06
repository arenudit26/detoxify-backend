import express from "express";
import { loginWithGoogle, googleCallback } from "../controllers/auth.controller.js";

const router = express.Router() ;
router.get("/status", (req, res) => {
  if (req.session?.tokens) {
    return res.json({ loggedIn: true });
  } else {
    return res.json({ loggedIn: false });
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("detoxify.sid");
    return res.json({ loggedIn: false });
  });
});

router.get("/google",loginWithGoogle);

router.get("/google/callback", googleCallback);


export default router;