import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    language: {
      type: Schema.Types.ObjectId,
      ref: "faqLanguage",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "faqCategory",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Faq = mongoose.model("faq", schema);
