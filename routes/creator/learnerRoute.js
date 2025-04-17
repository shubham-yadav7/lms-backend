import express from "express";
import {
  addLearner,
  assignToLearner,
  changePassword,
  getLearnerDetails,
  deleteLearner,
  editLearner,
  exportLearners,
  getAllLearners,
  learnerPurchases,
  getAllDeletedLearners,
  restoreLearner,
} from "../../controllers/creator/learnerController.js";
import upload from "../../middleWares/uploads.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    upload,
    addLearner
  );
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("user"), getAllLearners);
router
  .route("/:id/assign/:type")
  .get(authorizedCreator, checkCreatorsModuleAccess("user"), assignToLearner);
router
  .route("/:id/purchases")
  .get(authorizedCreator, checkCreatorsModuleAccess("user"), learnerPurchases);
router
  .route("/:id/change-password")
  .put(authorizedCreator, checkCreatorsModuleAccess("user"), changePassword);
router
  .route("/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    getAllDeletedLearners
  );
router
  .route("/:id/restore-deleted-learner")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    restoreLearner
  );
router
  .route("/export")
  .get(authorizedCreator, checkCreatorsModuleAccess("user"), exportLearners);
router
  .route("/:id")
  .get(authorizedCreator, checkCreatorsModuleAccess("user"), getLearnerDetails)
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    upload,
    editLearner
  )
  .delete(authorizedCreator, checkCreatorsModuleAccess("user"), deleteLearner);

export default router;
