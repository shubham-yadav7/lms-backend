import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "creator",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    slug: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address."],
      validate: validator.isEmail,
    },
    password: {
      type: String,
      select: false,
    },
    designation: {
      type: String,
    },
    description: {
      type: String,
    },
    profileImg: {
      type: String,
    },
    type: {
      type: String,
      default: "instructor",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "creator",
    },
    status: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    modules: [
      {
        type: String,
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

schema.methods.getResetToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 50 * 60 * 1000;
  return resetToken;
};

export const Instructor = mongoose.model("instructor", schema);
