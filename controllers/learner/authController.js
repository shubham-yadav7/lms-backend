import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Learner } from "../../models/Learner.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendToken } from "../../utils/sendToken.js";
import crypto from "crypto";
import { deleteFile } from "../../utils/deleteFile.js";
import { Course } from "../../models/Course.js";

export const sendConfirmationOtp = catchAsyncError(async (req, res, next) => {
  const { email, phone, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password must be same.")
    );
  }

  let learner = await Learner.findOne({
    $or: [{ email: email }, { phone: phone }],
    deleted: false,
    status: true,
  });

  if (learner) {
    return next(new ErrorHandler("Email or Phone already registered.", 400));
  }

  if (process.env.NODE_ENV === "production") {
    // TODO: Use SMS api for sent otp
  }

  return res.status(200).json({
    success: true,
    message: "OTP sent to your mobile number.",
  });
});

export const loginLearner = catchAsyncError(async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  const learner = await Learner.findOne({

    $or: [{ email: email }, { phone: email }],
    deleted: false,
    status: true,
  }).select("+password");

  if (!learner) {
    return next(
      new ErrorHandler("Account with this credentials doesn't exist.", 401)
    );
  }

  if (learner.status === false) {
    return next(
      new ErrorHandler(
        "Your account is deactivate. Please contact creator to retrieve your account.",
        403
      )
    );
  }

  let isMatch = await learner.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid login credentials", 401));
  }

  sendToken(learner, 200, res);
});

export const registerLearner = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    privacyPolicy,
    otp,
  } = req.body;

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password must be same.")
    );
  }

  let learner = await Learner.findOne({
    $or: [{ email: email }],
    deleted: false,
    status: true,
  });

  if (learner) {
    return next(new ErrorHandler("Email or Phone already registered.", 400));
  }

  if (process.env.NODE_ENV === "production") {
    // TODO: Use SMS api for otp verification
  }

  let _learner = {

    firstName,
    lastName,
    email,
    phone,
    password,
  };

  learner = await Learner.create(_learner);
  // TODO: Send Registration email

  sendToken(learner, 200, res);

});

export const learnerForgetPassword = catchAsyncError(async (req, res, next) => {
  let mobileNumber = req.body.phone;

  if (mobileNumber.length < 10) {
    return next(new ErrorHandler("Please provide valid phone number.", 422));
  }

  if (mobileNumber.length === 10) {
    mobileNumber = mobileNumber.replace(/^/, "+91");
  }

  const learner = await Learner.findOne({
    create: req.creatorInfo._id,
    phone: req.body.phone,
    deleted: false,
    status: true,
  });
  if (!learner) {
    return next(
      new ErrorHandler("Account with this phone number does not exist", 422)
    );
  }

  if (process.env.NODE_ENV === "production") {
    // TODO: Add SMS Api for send OTP
  }

  res.status(200).json({
    success: true,
    message: "OTP sent successfully.",
  });
});

export const verifyResetOtp = catchAsyncError(async (req, res, next) => {
  let mobileNumber = req.body.phone;
  let { otp, phone } = req.body;

  if (!otp || !phone) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  if (mobileNumber.length < 10) {
    return next(new ErrorHandler("Please provide valid phone number.", 422));
  }

  if (mobileNumber.length === 10) {
    mobileNumber = mobileNumber.replace(/^/, "+91");
  }

  let verifyResult;
  if (process.env.NODE_ENV === "production") {
    // verifyResult = TODO: Verify through SMS api
  }
  if (verifyResult && verifyResult.data.type === "error") {
    return next(new ErrorHandler("Invalid OTP", 422));
  }

  let learner = await Learner.findOne({

    phone: req.body.phone,
    deleted: false,
    status: true,
  });

  if (!learner) {
    return next(
      new ErrorHandler("Account not found or account is deactivated", 400)
    );
  }

  const resetToken = await learner.getResetToken();

  await learner.save();

  res.status(200).json({
    success: true,
    token: resetToken,
    message: "OTP Verification Successful.",
  });
});

export const resetPasswordLearner = catchAsyncError(async (req, res, next) => {
  const { newPassword, confirmPassword, resetToken } = req.body;

  if (!newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please provide all fields", 422));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("Password and confirm password does not match.", 422)
    );
  }

  let resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const learner = await Learner.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!learner) {
    return next(new ErrorHandler("Token is invalid or has been expired", 401));
  }

  learner.password = newPassword;
  learner.resetPasswordToken = undefined;
  learner.resetPasswordExpire = undefined;

  await learner.save();
  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
  });
});

export const getLearnerDetails = catchAsyncError(async (req, res, next) => {
  const learner = await Learner.findOne({
    _id: req.user,

    deleted: false,
    status: true,
  });

  if (!learner) {
    return next(new ErrorHandler("Learner not found", 401));
  }

  const enrolledCourses = await Course.find({
    learners: learner._id,
  });


  res.status(200).json({
    success: true,
    learner,
    enrolledCourses
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { type } = req.query;
  let _message = "Account details updated successfully.";
  const learner = await Learner.findOne({
    _id: req.user,

    deleted: false,
    status: true,
  });

  if (!learner) return next(new ErrorHandler("Your account is inactive", 403));

  switch (type) {
    case "profile-update": {
      const { firstName, lastName, email } = req.body;
      await Learner.updateOne(
        { _id: req.user },
        { firstName, lastName, email }
      );
      break;
    }
    case "address-update": {
      const {
        address,
        pinCode,
        state: { label: state },
        city: { label: city },
      } = req.body;
      await Learner.updateOne(
        { _id: req.user },
        { address, pinCode, state, city }
      );
      break;
    }
    case "remove-profile": {
      if (learner.profileImg) {
        deleteFile(
          learner.profileImg,
          `./public/uploads/user/profile/${learner.profileImg}`
        );
        learner.profileImg = undefined;
        await learner.save();
        _message = "Profile removed successfully.";
      }
    }
  }

  res.status(200).json({
    success: true,
    message: _message,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword)
    return next(
      new ErrorHandler("New password and confirm password doesn't match", 422)
    );

  const learner = await Learner.findOne({
    _id: req.user,

    deleted: false,
    status: true,
  }).select("+password");

  if (!learner) {
    return next(new ErrorHandler("Account not exists or deactivated", 401));
  }

  let isMatch = await learner.comparePassword(oldPassword);
  if (!isMatch) {
    return next(new ErrorHandler("Old password doest not match", 422));
  }

  learner.password = newPassword;
  await learner.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

export const updatePhone = catchAsyncError(async (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    // TODO: Verify through SMS api
    // const result = await axios.get(
    //   `https://api.msg91.com/api/v5/otp/verify?otp=${req.body.otp}&authkey=${process.env.MSG91_KEY}&mobile=91${req.body.phone}`
    // );
    // if (result.data.type === "error") {
    //   return res.status(400).json({ message: "Invalid OTP" });
    // }
  }
  await Learner.findByIdAndUpdate(req.user, {
    phone: req.body.phone,
  });
  res.status(200).json({
    success: true,
    message: "Phone no Update Successfully",
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  // TODO: change req.user to req.user = {}
  const learner = await Learner.findById(req.user);
  if (learner.profileImg) {
    deleteFile(
      learner.profileImg,
      `./public/uploads/user/profile/${learner.profileImg}`
    );
  }

  if (req.files.userProfileImg) {
    learner.profileImg = req.files.userProfileImg[0].filename;
  }

  await learner.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
  });
});
