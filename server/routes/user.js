import express from "express";
import crypto from "crypto-js"
import uid2 from "uid2";
import User from "../models/User.js";
import dotenv from "dotenv";
//import { Resend } from "resend";

dotenv.config();
//const resend = new Resend(process.env.RESEND_KEY);
const router = express.Router();

router.post("/signin", async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const emailExist = await User.find({ email });
        const usernameExist = await User.find({ username });

        if (!emailExist[0]) {
            if (!usernameExist[0]) {
                const code = uid2(8);
                const token = uid2(64);
                const salt = uid2(32);
                const hash = crypto.SHA256(salt + password).toString(crypto.enc.Base64);
                const newUser = new User({
                    username,
                    email,
                    colorA: "#93EC9C",
                    colorB: "#2CA254",
                    token,
                    salt,
                    hash,
                    code,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                });
                /*resend.emails.send({
                    from: `ChatWings <${process.env.EMAIL_ADMIN}>`,
                    to: email,
                    subject: 'Verification code',
                    html: `<p>Hello new user !</p><br><p>This is your code to valid your Chatwings account : <strong>${code}</strong></p><p>WARING : This code is valid for next 24 hours.</p><br><p>Go <a href="http://localhost:3500/verify">actived my account</a> with code</p>`
                });*/
                await newUser.save();
                return res.status(200).json({ message: "User created successfully !" })
            } else return res.status(409).json({ message: "Username already used"});
        } else return res.status(409).json({ message: "Email already used"});
    } catch (err) {
        return res.status(500).json({ message: err});
    }
});
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        const userExit = await User.find({ username });
        if (userExit[0]) {
            if (userExit[0].hash === crypto.SHA256(userExit[0].salt + password).toString(crypto.enc.Base64)) {
                console.log(userExit[0])
                if (userExit[0].expiresAt === null) {
                    return res.status(200).json({ message: "User connected successfully", token: userExit[0].token, username: userExit[0].username, colorA: userExit[0].colorA, colorB: userExit[0].colorB });
                } else return res.status(403).json({ message: "Your account is not actived" })
            } else return res.status(401).json({ message: "Invalid username or password" });
        } else return res.status(401).json({ message: "Invalid username or password" })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
})
router.patch("/colors", async (req, res) => {
    try {
        const { username, colorA, colorB } = req.body;
        await User.updateOne({ username }, { colorA, colorB });
        return res.status(200).json({ message: "Colors changed successfully !" });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
})
router.patch("/verify", async (req, res) => {
    try {
        const { email, code } = req.body;
        const userExiter = await User.find({ email });
        if (userExiter[0]) {
            if (userExiter[0].code === code) {
                await userExiter[0].updateOne({ $unset: {code: "" , expiresAt: null } })
                return res.status(200).json({ message: "Account verified" });
            } else return res.status(401).json({ message: "Wrong code" })
        } else return res.status(401).json({ message: "Invalid email" })
    } catch (err) {
        return res.status(500).json({ message: err });
    }
})

export default router;
