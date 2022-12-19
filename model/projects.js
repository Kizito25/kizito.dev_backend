import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    photo: {
      type: String,
    },
    mobile_photo: {
      type: String,
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
    link: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      default: "https://github.com/Kizito25/",
    },
    stacks: {
      type : [String]
    },
    platform: {
      type : [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
