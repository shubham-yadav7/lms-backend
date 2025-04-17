import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Creator } from "../../models/Creator.js";
import moment from "moment";
import { modules } from "../../utils/presetData.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import slugify from "slugify";

export const addSubCreator = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    modules,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    return next(new ErrorHandler("All fields are required.", 422));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does'nt match", 422)
    );
  }

  let _subCreator = {
    firstName,
    lastName,
    email,
    phone,
    password,
    brandName: req.user.brandName,
    slug: slugify(`${firstName} ${lastName}`, { lower: true }),
    createdBy: req.user._id,
  };
  if (modules) {
    _subCreator.modules = Array.isArray(modules) ? modules : [modules];
  }

  await Creator.create(_subCreator);
  req.flash("success", "Sub creator created successfully");
  res.redirect("/api/creator/sub-creator/list");
});
export const getAllSubCreator = catchAsyncError(async (req, res, next) => {
  const subCreators = await Creator.find({
    createdBy: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
    role: "sub-creator",
  }).sort({ createdAt: -1 });

  res.render("creator/sub-creator/subcreator-list", {
    subCreators,
    moment,
    modules,
  });
});
export const editSubCreator = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, phone, modules } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return next(new ErrorHandler("All fields are required.", 422));
  }

  const subCreator = await Creator.findById(req.params.id);
  if (!subCreator) {
    return next(new ErrorHandler("Sub creator not found", 404));
  }

  subCreator.firstName = firstName;
  subCreator.lastName = lastName;
  subCreator.email = email;
  subCreator.phone = phone;
  subCreator.slug = slugify(`${firstName} ${lastName}`, { lower: true });

  if (modules) {
    subCreator.modules = Array.isArray(modules) ? modules : [modules];
  }
  await subCreator.save();

  req.flash("success", "Sub creator updated successfully.");
  res.redirect("/api/creator/sub-creator/list");
});
export const deletedSubCreator = catchAsyncError(async (req, res, next) => {
  const subCreator = await Creator.findById(req.params.id);

  if (!subCreator) {
    return next(new ErrorHandler("Sub creator not found", 404));
  }

  subCreator.deleted = true;
  await subCreator.save();

  req.flash("success", "Sub creator deleted successfully");
  res.redirect("/api/creator/sub-creator/list");
});
export const getAllDeletedSubCreator = catchAsyncError(
  async (req, res, next) => {
    const subCreators = await Creator.find({
      createdBy:
        req.user.role === "creator" ? req.user._id : req.user.createdBy,
      deleted: true,
      role: "sub-creator",
    }).sort({ createdAt: -1 });

    res.render("creator/sub-creator/subcreator-deleted", {
      subCreators,
      moment,
    });
  }
);
export const restoreSubCreator = catchAsyncError(async (req, res, next) => {
  const subCreator = await Creator.findById(req.params.id);

  if (!subCreator) {
    return next(new ErrorHandler("Sub creator not found", 404));
  }

  subCreator.deleted = false;
  await subCreator.save();

  req.flash("success", "Sub creator restored successfully");
  res.redirect("/api/creator/sub-creator/list");
});
export const changeSubCreatorPassword = catchAsyncError(
  async (req, res, next) => {
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler("Password and confirm password does'nt match", 422)
      );
    }

    const subCreator = await Creator.findById(req.params.id);

    if (!subCreator) {
      return next(new ErrorHandler("Sub creator not found", 404));
    }

    subCreator.password = newPassword;
    await subCreator.save();

    req.flash("success", "Password updated successfully");
    res.redirect("/api/creator/sub-creator/list");
  }
);
export const changeSubCreatorStatus = catchAsyncError(
  async (req, res, next) => {
    const subCreator = await Creator.findById(req.params.id);

    if (!subCreator) {
      return next(new ErrorHandler("Sub creator not found", 404));
    }

    subCreator.status = !(req.query.status === "true");
    await subCreator.save();

    req.flash("success", "Sub creator status updated successfully");
    res.redirect("/api/creator/sub-creator/list");
  }
);
