import express from "express";
import crypto from "crypto-js"
import uid2 from "uid2";
import User from "../models/User.js";

const router = express.Router();

router.post("/signin", async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const emailExist = await User.find({ email });
        const usernameExist = await User.find({ username });

        if (!emailExist[0]) {
            if (!usernameExist[0]) {
                const token = uid2(64);
                const salt = uid2(16);
                const hash = crypto.SHA256(salt + password).toString(crypto.enc.Base64);
                const newUser = new User({
                    username,
                    email,
                    colorA: "#93EC9C",
                    colorB: "#2CA254",
                    token,
                    salt,
                    hash,
                });
                await newUser.save();
                res.status(200).json({ message: "User created successfully !" })
            } else res.status(409).json({ message: "Username already used"});
        } else res.status(409).json({ message: "Email already used"});
    } catch (err) {
        res.status(500).json({ message: err});
    }
});
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        const userExit = await User.find({ username });
        if (userExit[0]) {
            if (userExit[0].hash === crypto.SHA256(userExit[0].salt + password).toString(crypto.enc.Base64)) {
                res.status(200).json({ message: "User connected successfully", token: userExit[0].token, username: userExit[0].username, colorA: userExit[0].colorA, colorB: userExit[0].colorB });
            } else res.status(401).json({ message: "Invalid username or password" });
        } else res.status(401).json({ message: "Invalid username or password" })
    } catch (err) {
        res.status(500).json({ message: err });
    }
})
router.patch("/colors", async (req, res) => {
    try {
        const { username, colorA, colorB } = req.body;
        await User.updateOne({ username }, { colorA, colorB });
        res.status(200).json({ message: "Colors changed successfully !" });
    } catch (err) {
        res.status(500).json({ message: err });
    }
})

export default router;
