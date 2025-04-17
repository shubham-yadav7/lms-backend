import express from "express";
import {
  getLearnerDetails,
  loginLearner,
  registerLearner,
  sendConfirmationOtp,
  learnerForgetPassword,
  verifyResetOtp,
  resetPasswordLearner,
  updateProfile,
  changePassword,
  updatePhone,
  updateProfilePicture,
} from "../../controllers/learner/authController.js";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";
import passport from "passport";
import upload from '../../middleWares/uploads.js'

const router = express.Router();

router
  .route("/confirm-verification")
  .post(extractCreatorInfo, sendConfirmationOtp);
router.route("/login").post(extractCreatorInfo, loginLearner);
router.route("/register").post(extractCreatorInfo, registerLearner);
router
  .route("/forgot-password")
  .post(extractCreatorInfo, learnerForgetPassword);
router.route("/verify-reset-otp").post(extractCreatorInfo, verifyResetOtp);
router.route("/reset-password").post(extractCreatorInfo, resetPasswordLearner);

router
  .route("/user-details")
  .get(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    getLearnerDetails
  );

router
  .route("/update-profile")
  .post(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    updateProfile
  );
router
  .route("/update-profile-picture")
  .put(
    upload,
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    updateProfilePicture
  );

router
  .route("/change-password")
  .post(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    changePassword
  );

router
  .route("/update-phone")
  .post(
    extractCreatorInfo,
    passport.authenticate("jwt", { session: false }),
    updatePhone
  );

export default router;
