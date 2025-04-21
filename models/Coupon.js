import mongoose, { Schema } from "mongoose";

const schema = new mongoose.Schema(
  {
    // creator: {
    //   type: Schema.Types.ObjectId,
    //   ref: "creator",
    //   required: true,
    // },
    type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    code: {
      type: String,
      required: true,
    },
    couponValue: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    courses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "course",
      },
    ],
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "product",
      },
    ],
    minPurchaseAmount: {
      type: Number,
    },
    discountUpTo: {
      type: Number,
    },
    noOfUses: {
      type: Number,
    },
    noOfUsesPerUser: {
      type: Number,
      default: 1,
    },
    onlyForNewUser: {
      type: Boolean,
      default: false,
    },
    expiredAt: {
      type: Date,
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

export const Coupon = mongoose.model("coupon", schema);
