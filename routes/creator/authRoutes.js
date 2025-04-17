import express from "express";
import {
  registerCreator,
  logoutCreator,
  creatorLoginPage,
  creatorRegisterPage,
  creatorForgotPasswordPage,
  creatorResetPasswordPage,
  creatorForgotPassword,
  creatorResetPassword,
  creatorChangePassword,
} from "../../controllers/creator/authController.js";
import passport from "passport";

const router = express.Router();

router.route("/register").post(registerCreator).get(creatorRegisterPage);

router
  .route("/login")
  .post(
    passport.authenticate("creatorLocal", {
      failureRedirect: "/api/creator/auth/login",
      failureFlash: true,
      successFlash: `Welcome To my Admin Dashboard`,
    }),
    (req, res) => {
      res.redirect("/api/creator/");
    }
  )
  .get(creatorLoginPage);

router.route("/logout").get(logoutCreator);

router
  .route("/forget-password")
  .post(creatorForgotPassword)
  .get(creatorForgotPasswordPage);
router
  .route("/reset-password/:token")
  .put(creatorResetPassword)
  .get(creatorResetPasswordPage);

router.route("/change-password").put(creatorChangePassword);

export default router;
