import express from "express";
import {
  AllDeletedQuiz,
  addQuiz,
  addQuizQuestion,
  deleteQuiz,
  deleteQuizQuestion,
  editQuiz,
  editQuizQuestion,
  getAllQuiz,
  getAllQuizQuestions,
  importQuizQuestions,
  restoreQuiz,
} from "../../controllers/creator/quizController.js";
import upload from "../../middleWares/uploads.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

// Quiz routes
router
  .route("/:courseId/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("course"), addQuiz);

router
  .route("/:courseId/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("course"), getAllQuiz);

router
  .route("/:courseId/deleted")
  .get(authorizedCreator, checkCreatorsModuleAccess("course"), AllDeletedQuiz);

router
  .route("/:courseId/:id/restore-deleted-quiz")
  .put(authorizedCreator, checkCreatorsModuleAccess("course"), restoreQuiz);

router
  .route("/:courseId/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("course"), editQuiz)
  .delete(authorizedCreator, checkCreatorsModuleAccess("course"), deleteQuiz);

// Quiz questions routes
router
  .route("/:quizId/question/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    addQuizQuestion
  );

router
  .route("/:quizId/question/import")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    importQuizQuestions
  );

router
  .route("/:quizId/question/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    getAllQuizQuestions
  );

router
  .route("/:quizId/question/:quizQuestionId")
  .put(authorizedCreator, checkCreatorsModuleAccess("course"), editQuizQuestion)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    deleteQuizQuestion
  );

export default router;
