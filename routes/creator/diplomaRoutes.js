import express from "express";
import upload from "../../middleWares/uploads.js";
import {
  AllDeletedDiplomas,
  addDiploma,
  addDiplomaQuestion,
  deleteDiploma,
  editDiplomaQuestion,
  deleteDiplomaQuestion,
  editDiploma,
  getAllDiplomaQuestions,
  getAllDiplomas,
  restoreDiploma,
  importDiplomaQuestions,
} from "../../controllers/creator/diplomaController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

// Diploma routes
router
  .route("/:bundleId/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("course"), addDiploma);

router
  .route("/:bundleId/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("course"), getAllDiplomas);

router
  .route("/:bundleId/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    AllDeletedDiplomas
  );

router
  .route("/:bundleId/:id/restore-deleted-diploma")
  .put(authorizedCreator, checkCreatorsModuleAccess("course"), restoreDiploma);

router
  .route("/:bundleId/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("course"), editDiploma)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    deleteDiploma
  );

// Diploma questions routes
router
  .route("/:diplomaId/question/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    addDiplomaQuestion
  );

router
  .route("/:diplomaId/question/import")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    importDiplomaQuestions
  );

router
  .route("/:diplomaId/question/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    getAllDiplomaQuestions
  );

router
  .route("/:diplomaId/question/:quizId")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    editDiplomaQuestion
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    deleteDiplomaQuestion
  );

export default router;
