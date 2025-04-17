import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    quizType: {
      type: Schema.Types.ObjectId,
      refPath: "type",
    },
    type: {
      type: String,
      enum: ["diploma", "quiz"],
    },
    items: [
      {
        questionNumber: {
          type: Number,
          trim: true,
        },
        typeOfQuestion: {
          type: String,
          trim: true,
          enum: ["singleSelect", "multiSelect", "yesOrNo"],
        },
        question: {
          type: String,
          trim: true,
        },
        choice: [
          {
            type: String,
            trim: true,
          },
        ],
        // Answers
        singleSelect: {
          type: String,
          trim: true,
        },
        multiSelect: [
          {
            type: String,
            trim: true,
          },
        ],
        yesOrNo: {
          type: Boolean,
        },
        // TODO: Do it letter
        pairs: [{}],
      },
    ],
    deleted: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const QuizQuestions = mongoose.model("quizQuestions", schema);
