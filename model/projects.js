import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      // required: true,
    },
    photo: {
      type: Date,
      default: Date,
    },
    images: {
      type: [],
    },
    type: {
      type: [String],
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
