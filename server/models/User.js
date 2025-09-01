import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true},
  salt: { type: String, required: true},
  hash: { type: String, required: true},
});

export default mongoose.model('User', userSchema);
