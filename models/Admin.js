import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    role: {
      type: String,
      enum: ["admin", "sub-admin"],
      default: "sub-admin",
    },
    modules: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      default: "creator",
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

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

export const Admin = mongoose.model("admin", schema);
