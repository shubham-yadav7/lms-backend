import express from "express";
import { extractCreatorInfo } from "../../middleWares/accessAuth.js";
import { searchInputResult } from "../../controllers/learner/primaryController.js";
import { getActiveAnnouncement } from "../../controllers/creator/announcementController.js";
import { getAllBannersList } from "../../controllers/creator/bannerController.js";
import { getAllTestimonialsList } from "../../controllers/creator/testimonialController.js";
import { getAllFeedBackVideosList } from "../../controllers/creator/feedbackVideoController.js";
import { addNewsLetter } from "../../controllers/creator/newsLetterController.js";
import { addContact } from "../../controllers/creator/contactController.js";
import { getAllFaqsList } from "../../controllers/creator/faqController.js";

const router = express.Router();

router.route("/announcement").get(extractCreatorInfo, getActiveAnnouncement);
router.route("/search").get(extractCreatorInfo, searchInputResult);
router.route("/banner/list").get(extractCreatorInfo, getAllBannersList);
router
  .route("/testimonial/list")
  .get(extractCreatorInfo, getAllTestimonialsList);
router
  .route("/feedback/list")
  .get(extractCreatorInfo, getAllFeedBackVideosList);
router.route("/newsletter/add").post(extractCreatorInfo, addNewsLetter);
router.route("/contact/add").post(extractCreatorInfo, addContact);
router.route("/faq/list").get(extractCreatorInfo, getAllFaqsList);

export default router;
