import express from "express";
import User from "../models/User.js";
/*const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");*/

const router = express.Router();

router.post("/signin", async(req, res) => {
    const { username, password, email } = req.params;
    const emailExist = await User.find({ email: email });
    const usernameExist = await User.find({ "account.username": username });

    if (!emailExist[0] && !usernameExist[0]) {
      /*const token = uid2(64);
      const salt = uid2(16);
      const hash = SHA256(salt + password).toString(encBase64);*/

      const newUser = new User({
        username: username,
        email: email,
        /*token: token,
        salt: salt,
        hash: hash,*/
      });
      await newUser.save();
    }
});

export default router;
