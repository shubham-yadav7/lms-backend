import express from "express";
import {
  profilePage,
  settingListingPage,
  updateProfile,
} from "../../controllers/creator/settingController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("settings"),
    settingListingPage
  );
router
  .route("/profile")
  .get(authorizedCreator, checkCreatorsModuleAccess("settings"), profilePage);
router
  .route("/profile/update-profile")
  .put(authorizedCreator, checkCreatorsModuleAccess("settings"), updateProfile);

export default router;
