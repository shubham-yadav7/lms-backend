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
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const FaqLanguage = mongoose.model("faqLanguage", schema);
