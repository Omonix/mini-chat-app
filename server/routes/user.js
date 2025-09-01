import express from "express";
import SHA256 from "crypto-js/sha256.js";
import encBase64 from "crypto-js/enc-Base64.js"
import uid2 from "uid2";
import User from "../models/User.js";

const router = express.Router();

router.post("/signin", async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const emailExist = await User.find({ email });
        const usernameExist = await User.find({ username });

        if (!emailExist[0] && !usernameExist[0]) {
            const token = uid2(64);
            const salt = uid2(16);
            const hash = SHA256(salt + password).toString(encBase64);
            const newUser = new User({
                username,
                email,
                token,
                salt,
                hash,
            });
            await newUser.save();
        }
    } catch (error) {
        console.log("VERY BIG ERROR", error);
    }
});

export default router;
