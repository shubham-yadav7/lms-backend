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
import passport from "passport";
import upload from '../../middleWares/uploads.js'

const router = express.Router();

router
  .route("/confirm-verification")
  .post(sendConfirmationOtp);
router.route("/login").post(loginLearner);
router.route("/register").post(registerLearner);
router
  .route("/forgot-password")
  .post(learnerForgetPassword);
router.route("/verify-reset-otp").post(verifyResetOtp);
router.route("/reset-password").post(resetPasswordLearner);

router
  .route("/user-details")
  .get(
        passport.authenticate("jwt", { session: false }),
    getLearnerDetails
  );

router
  .route("/update-profile")
  .post(
        passport.authenticate("jwt", { session: false }),
    updateProfile
  );
router
  .route("/update-profile-picture")
  .put(
    upload,
        passport.authenticate("jwt", { session: false }),
    updateProfilePicture
  );

router
  .route("/change-password")
  .post(
        passport.authenticate("jwt", { session: false }),
    changePassword
  );

router
  .route("/update-phone")
  .post(
        passport.authenticate("jwt", { session: false }),
    updatePhone
  );

export default router;
