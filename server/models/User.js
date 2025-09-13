import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/ },
  colorA: { type: String, default: "#93EC9C"},
  colorB: { type: String, default: "#2CA254"},
  token: { type: String, required: true, unique: true },
  salt: { type: String, required: true},
  hash: { type: String, required: true},
  code: {type: String, required: true},
  expiresAt: {
    type: Date,
    default: null
  }
});

export default mongoose.model('User', userSchema);
