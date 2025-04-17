import express from "express";
import {
  addFaq,
  addFaqCategories,
  addFaqLanguage,
  deleteFaq,
  deleteFaqCategories,
  deleteFaqLanguage,
  editFaq,
  editFaqCategories,
  editFaqLanguage,
  getAllFaq,
  getAllFaqCategories,
  getAllFaqLanguages,
} from "../../controllers/creator/faqController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

// FAQ Category
router
  .route("/category/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("faq"), addFaqCategories);
router
  .route("/category/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("faq"),
    getAllFaqCategories
  );
router
  .route("/category/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("faq"), editFaqCategories)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("faq"),
    deleteFaqCategories
  );

// FAQ Language
router
  .route("/language/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("faq"), addFaqLanguage);
router
  .route("/language/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("faq"), getAllFaqLanguages);
router
  .route("/language/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("faq"), editFaqLanguage)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("faq"),
    deleteFaqLanguage
  );

// FAQ
router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("faq"), addFaq);
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("faq"), getAllFaq);
router
  .route("/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("faq"), editFaq)
  .delete(authorizedCreator, checkCreatorsModuleAccess("faq"), deleteFaq);

export default router;
