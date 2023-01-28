import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
