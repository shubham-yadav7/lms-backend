import mongoose from "mongoose";
const { Schema } = mongoose;

const PurchasedItemSchema = new Schema(
    {
        learner: {
            type: Schema.Types.ObjectId,
            ref: "learner", // or "learner" if you have a separate model
            required: true,
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "course",
            required: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "creator",
        },
        orderId: {
            type: String,
          
        },
        paymentStatus: {
            type: String,
            enum: ["PAID", "FAILED", "PENDING"],
            default: "PENDING",
        },
        paymentProvider: {
            type: String,
            enum: ["cashfree", "razorpay"],
            default: "cashfree",
        },
        paymentInfo: {
            type: Object,
            default: {},
        },
        pricePaid: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("purchasedItem", PurchasedItemSchema);
