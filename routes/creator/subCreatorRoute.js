import express from "express";
import {
  addSubCreator,
  changeSubCreatorPassword,
  changeSubCreatorStatus,
  deletedSubCreator,
  editSubCreator,
  getAllDeletedSubCreator,
  getAllSubCreator,
  restoreSubCreator,
} from "../../controllers/creator/subCreatorController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("user"), addSubCreator);
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("user"), getAllSubCreator);
router
  .route("/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    getAllDeletedSubCreator
  );
router
  .route("/:id/restore-deleted-subcreator")
  .put(authorizedCreator, checkCreatorsModuleAccess("user"), restoreSubCreator);
router
  .route("/:id/change-subcreator-password")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    changeSubCreatorPassword
  );
router
  .route("/:id/change-subcreator-status")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    changeSubCreatorStatus
  );
router
  .route("/:id")
  .put(editSubCreator)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("user"),
    deletedSubCreator
  );

export default router;
