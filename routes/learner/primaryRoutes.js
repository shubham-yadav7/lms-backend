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

router.route("/announcement").get(getActiveAnnouncement);
router.route("/search").get(searchInputResult);
router.route("/banner/list").get(getAllBannersList);
router
  .route("/testimonial/list")
  .get(getAllTestimonialsList);
router
  .route("/feedback/list")
  .get(getAllFeedBackVideosList);
router.route("/newsletter/add").post(addNewsLetter);
router.route("/contact/add").post(addContact);
router.route("/faq/list").get(getAllFaqsList);

export default router;
