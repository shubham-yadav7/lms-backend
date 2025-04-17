import express from "express";
import upload from "../../middleWares/uploads.js";
import {
  addCourseBundle,
  deleteCourseBundle,
  AllDeletedCourseBundles,
  editCourseBundle,
  editCourseBundlePage,
  getAllCourseBundles,
  restoreCourseBundle,
} from "../../controllers/creator/courseBundleController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";
const router = express.Router();

router
  .route("/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    addCourseBundle
  );

router
  .route("/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    getAllCourseBundles
  );

router
  .route("/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    AllDeletedCourseBundles
  );

router
  .route("/:id/restore-deleted-course-bundle")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    restoreCourseBundle
  );

router
  .route("/:id")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    editCourseBundlePage
  )
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    editCourseBundle
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    deleteCourseBundle
  );

export default router;
