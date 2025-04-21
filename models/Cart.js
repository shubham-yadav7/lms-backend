import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    // creator: {
    //   type: Schema.Types.ObjectId,
    //   ref: "creator",
    //   required: true,
    // },
    learner: {
      type: Schema.Types.ObjectId,
      ref: "learner",
      required: true,
    },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model("cart", schema);
