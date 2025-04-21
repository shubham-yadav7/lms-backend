import ErrorHandler from "../../utils/ErrorHandler.js";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Creator } from "../../models/Creator.js";
import slugify from "slugify";
import { sendResponse } from "../../utils/sendResponse.js";
import { sendEmail } from "../../utils/sendEmail.js";
import crypto from "crypto";

// Register
export const creatorRegisterPage = catchAsyncError(async (req, res, next) => {
  res.render("creator/auth/register");
});
export const registerCreator = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
  } = req.body;

  let creator = await Creator.findOne({ email });
  if (creator) {
    return next(new ErrorHandler("Email already registered.", 409));
  }
  if (phone.length < 10) {
    return next(new ErrorHandler("Please enter valid phone number.", 422));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does't match.", 422)
    );
  }

  let _creator = {
    firstName,
    lastName,
    email,
    phone,
    password,
    slug: slugify(`${firstName} ${lastName}`, { lower: true }),
  };

  creator = await Creator.create(_creator);

  req.flash("success", "Registration successful! Please login to continue");
  res.redirect("/api/creator/auth/login");
});

// Login
export const creatorLoginPage = catchAsyncError(async (req, res, next) => {
  res.render("creator/auth/login");
});

// Forgot password
export const creatorForgotPasswordPage = catchAsyncError(
  async (req, res, next) => {
    res.render("creator/auth/forget-password");
  }
);
export const creatorForgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  const creator = await Creator.findOne({ email });
  if (!creator) {
    return next(
      new ErrorHandler("Account with this email doesn't exist.", 409)
    );
  }

  const resetToken = await creator.getResetToken();

  await creator.save();

  // Send token via email
  const url = `${process.env.CREATOR_URL}/api/creator/auth/reset-password/${resetToken}`;
  const data = `<p>Click on the link to reset Password.</p> <a class="d-block" href="${url}">Click Here</a> <p>If you have not requested then please ignore. </p>`;
  const { response } = await sendEmail({
    to: creator.email,
    subject: `${creator.firstName} ${creator.lastName}, Forgot Password request.`,
    html: data,
  });

  console.log('Forget password token email response:',response);

  req.flash(
    "success",
    "Reset password link send to your registered email id."
  );
  res.redirect("/api/creator/auth/login");
});

// Reset password
export const creatorResetPasswordPage = catchAsyncError(
  async (req, res, next) => {

    return res.render("creator/auth/reset-password");
  }
);
export const creatorResetPassword = catchAsyncError(async (req, res, next) => {
  console.log("reset passwrd working")
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password does't match", 400)
    );

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const creator = await Creator.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!creator)
    return next(new ErrorHandler("Token is invalid or has been expired.", 401));

  creator.password = password;
  creator.resetPasswordToken = undefined;
  creator.resetPasswordExpire = undefined;

  creator.save();

  console.log("creator updated")

  req.flash("success", "Password reset successfully.");
  res.redirect("/api/creator/auth/login");
});

// Logout
export const logoutCreator = (req, res, next) => {
  try {
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/api/creator/auth/login");
  } catch (err) {
    return next(new ErrorHandler("Unable to logout, please try again.", 302));
  }
};

// change password
export const creatorChangePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword)
    return next(
      new ErrorHandler("Password and confirm password does't match", 400)
    );

  const creator = await Creator.findOne({ email: req.user.email }).select(
    "+password"
  );
  const correctPass = await creator.comparePassword(currentPassword);

  if (!correctPass) {
    return next(new ErrorHandler("Incorrect password", 401));
  }

  creator.password = newPassword;
  await creator.save();

  req.flash("success", "Password updated successfully.");
  res.redirect("/api/creator/setting/profile");
});
