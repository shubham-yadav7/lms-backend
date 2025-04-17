import express from "express";
import {
  addCourse,
  addCourseCategory,
  addCourseLanguage,
  courseTopicAdd,
  courseTopicDelete,
  courseTopicEdit,
  deleteCourse,
  deleteCourseCategory,
  deleteCourseLanguage,
  deletedCourses,
  editCourse,
  editCourseCategory,
  editCourseLanguage,
  editCoursePage,
  getAllCourseCategories,
  getAllCourseLanguages,
  getAllCourseTopics,
  getAllCourses,
  restoreDeletedCourse,
} from "../../controllers/creator/courseController.js";
import upload from "../../middleWares/uploads.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

// ---- Categories Routes ---- //
// Add course category
router
  .route("/category/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    addCourseCategory
  );

// Edit, Delete course category
router
  .route("/category/:id")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    editCourseCategory
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    deleteCourseCategory
  );

// course category list
router
  .route("/categories/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    getAllCourseCategories
  );

// ---- Course Languages Routes ---- //
// Add course language
router
  .route("/language/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    addCourseLanguage
  );

// Edit, Delete course Language
router
  .route("/language/:id")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    editCourseLanguage
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    deleteCourseLanguage
  );

// course language list
router
  .route("/languages/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    getAllCourseLanguages
  );

// ---- Course Routes ---- //
// Add course
router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("course"), addCourse);

// course list
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("course"), getAllCourses);

// deleted course list
router
  .route("/deleted")
  .get(authorizedCreator, checkCreatorsModuleAccess("course"), deletedCourses);

// restore deleted course
router
  .route("/:id/restore-deleted-course")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    restoreDeletedCourse
  );

// Edit , delete course
router
  .route("/:id")
  .get(authorizedCreator, checkCreatorsModuleAccess("course"), editCoursePage)
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    editCourse
  )
  .delete(authorizedCreator, checkCreatorsModuleAccess("course"), deleteCourse);

// ---- Course Topics Routes ---- //
// Add course topic
router
  .route("/:id/topic/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("course"), courseTopicAdd);

// course topic list
router
  .route("/:id/topic/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    getAllCourseTopics
  );

// Edit, delete course topic
router
  .route("/:id/topic/:topicId")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    upload,
    courseTopicEdit
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("course"),
    courseTopicDelete
  );

export default router;
