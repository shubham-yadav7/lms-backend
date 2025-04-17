import express from "express";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";
import {
  AddBanner,
  deleteBanner,
  editBanner,
  getAllBanners,
} from "../../controllers/creator/bannerController.js";
import upload from "../../middleWares/uploads.js";

const router = express.Router();

router
  .route("/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("banner"),
    upload,
    AddBanner
  );
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("banner"), getAllBanners);
router
  .route("/:id")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("banner"),
    upload,
    editBanner
  )
  .delete(authorizedCreator, checkCreatorsModuleAccess("banner"), deleteBanner);

export default router;
