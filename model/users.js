import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      required: true,
      // unique: [true, "Username already exists"],
      min: 3,
    },
    dob: {
      type: Date,
      default: Date,
    },
    email: {
      type: String,
      required: true,
      // unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: true,
      min: [6, "Must be at least 6 Characters"],
      max: [20, "Must not be more than 20 Characters"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superAdmin"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

