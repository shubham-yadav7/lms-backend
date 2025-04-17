import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { Creator } from "../../models/Creator.js";
import moment from "moment";

export const settingListingPage = catchAsyncError(async (req, res, next) => {
  res.render("creator/settings/setting-list");
});

export const profilePage = catchAsyncError(async (req, res, next) => {
  const creator = await Creator.findById(req.user._id);
  if (!creator) {
    return next(new ErrorHandler("Creator not found", 404));
  }
  res.render("creator/settings/profile", { creator, moment });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, brandName, dob, gender } =
    req.body;

  if (!firstName || !lastName || !email || !phone || !brandName) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  const creator = await Creator.findById(req.user._id);
  if (!creator) {
    return next(new ErrorHandler("Creator not found", 404));
  }

  creator.firstName = firstName;
  creator.lastName = lastName;
  creator.email = email;
  creator.brandName = brandName;
  if (dob) creator.dob = dob;
  if (gender) creator.gender = gender;

  await creator.save();

  req.flash("success", "Profile updated successfully");
  res.redirect("/api/creator/setting/profile");
});
