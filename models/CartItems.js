import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    cart: {
      type: Schema.Types.ObjectId,
      ref: "cart",
      required: true,
    },
    item: {
      type: Schema.Types.ObjectId,
      refPath: "type",
    },
    type: {
      type: String,
      enum: ["course", "courseBundle", "product"],
    },
    quantity: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const CartItem = mongoose.model("cartItem", schema);
