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
      default:
        "https://res.cloudinary.com/kizito25/image/upload/v1651962045/noun-alzheimer-2686167_efnbop.svg",
    },
    mobile_photo: {
      type: String,
      default:
        "https://res.cloudinary.com/kizito25/image/upload/v1651962045/noun-alzheimer-2686167_efnbop.svg",
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
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
