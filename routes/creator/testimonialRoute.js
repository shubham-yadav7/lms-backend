import express from "express";
import {
  addTestimonial,
  deleteTestimonial,
  editTestimonial,
  getAllTestimonials,
} from "../../controllers/creator/testimonialController.js";
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
    checkCreatorsModuleAccess("testimonials"),
    upload,
    addTestimonial
  );
router
  .route("/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("testimonials"),
    getAllTestimonials
  );
router
  .route("/:id")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("testimonials"),
    upload,
    editTestimonial
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("testimonials"),
    deleteTestimonial
  );

export default router;
