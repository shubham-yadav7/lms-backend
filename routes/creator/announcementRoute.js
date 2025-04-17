import express from "express";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";
import {
  addAnnouncement,
  deleteAnnouncement,
  editAnnouncement,
  getAllAnnouncement,
} from "../../controllers/creator/announcementController.js";

const router = express.Router();

router
  .route("/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("announcement"),
    addAnnouncement
  );

router
  .route("/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("announcement"),
    getAllAnnouncement
  );

router
  .route("/:id")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("announcement"),
    editAnnouncement
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("announcement"),
    deleteAnnouncement
  );

export default router;
