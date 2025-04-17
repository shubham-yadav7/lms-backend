import express from "express";
import {
  addInstructor,
  deleteInstructor,
  editInstructor,
  getAllDeletedInstructor,
  getAllInstructor,
  restoreInstructor,
  changeInstructorPassword,
  changeInstructorStatus,
  getInstructorDetails,
} from "../../controllers/creator/instructorController.js";
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
    checkCreatorsModuleAccess("instructor"),
    upload,
    addInstructor
  );
router
  .route("/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    getAllInstructor
  );
router
  .route("/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    getAllDeletedInstructor
  );
router
  .route("/:id/restore-deleted-instructor")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    restoreInstructor
  );
router
  .route("/:id/change-instructor-password")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    changeInstructorPassword
  );
router
  .route("/:id/change-instructor-status")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    changeInstructorStatus
  );
router
  .route("/:id")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    getInstructorDetails
  )
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    upload,
    editInstructor
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("instructor"),
    deleteInstructor
  );

export default router;
