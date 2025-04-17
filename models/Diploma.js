import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    courseBundle: {
      type: Schema.Types.ObjectId,
      ref: "courseBundle",
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
    description: {
      type: String,
      required: true,
    },
    noOfQuestions: {
      type: Number,
      default: 0,
    },
    quizQuestions: {
      type: Schema.Types.ObjectId,
      ref: "quizQuestions",
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

export const Diploma = mongoose.model("diploma", schema);
