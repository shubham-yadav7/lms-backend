import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name."],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name."],
    },
    brandName: {
      type: String,
      required: [true, "Please enter your brand name."],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email address."],
      validate: validator.isEmail,
      unique: [true, "Please use official email address."],
    },
    phone: {
      type: Number,
      required: [true, "Please enter your phone number."],
      minLength: [10, "Please enter valid phone number."],
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      minLength: [8, "Password must be greater than 8 characters."],
      select: false,
    },
    type: {
      type: String,
      default: "creator",
    },
    role: {
      type: String,
      enum: ["creator", "sub-creator"],
      default: "creator",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "creator",
    },
    status: {
      type: Boolean,
      default: true,
    },
    subscription: {
      id: String,
      status: String,
    },
    description: {
      type: String,
      minLength: [10, "Description must be greater than 10 characters."],
    },
    profile: {
      type: String,
    },
    modules: [
      {
        type: String,
      },
    ],
    domain: {
      type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
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

export const Creator = mongoose.model("creator", schema);
