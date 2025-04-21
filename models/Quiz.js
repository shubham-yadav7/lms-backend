import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "topic",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    topicName: {
      type: String,
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

export const Quiz = mongoose.model("quiz", schema);
