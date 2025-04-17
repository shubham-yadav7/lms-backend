import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please enter category name."],
    },
    slug: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: [true, "Please enter excerpt"],
    },
    icon: {
      type: String,
      required: [true, "Please provide category icon"],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CourseCategory = mongoose.model("courseCategory", schema);
