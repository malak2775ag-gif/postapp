import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  joindate: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;