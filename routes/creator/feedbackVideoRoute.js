import express from "express";
import {
  addFeedbackVideo,
  deleteFeedbackVideo,
  editFeedbackVideo,
  getAllFeedbackVideo,
} from "../../controllers/creator/feedbackVideoController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("cms"), addFeedbackVideo);
router
  .route("/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("cms"),
    getAllFeedbackVideo
  );
router
  .route("/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("cms"), editFeedbackVideo)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("cms"),
    deleteFeedbackVideo
  );

export default router;
