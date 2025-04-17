import express from "express";
import { dashboard } from "../../controllers/creator/primaryController.js";
import { authorizedCreator } from "../../middleWares/accessAuth.js";

const router = express.Router();

router.route("/").get(authorizedCreator, dashboard);

router.get("/course/details/:id/certificates", (req, res) => {
  res.render("creator/course/details/certificates", {
    courseId: req.params.id,
  });
});
router.get("/course/details/:id/reviews", (req, res) =>
  res.render("creator/course/details/reviews", { courseId: req.params.id })
);
router.get("/course/details/:id/learners", (req, res) =>
  res.render("creator/course/details/learners", { courseId: req.params.id })
);

router.get("/course-bundle/details/:id/certificates", (req, res) => {
  res.render("creator/course-bundle/details/certificates", {
    bundleId: req.params.id,
  });
});

router.get("/course-bundle/details/:id/certificates", (req, res) => {
  res.render("creator/course-bundle/details/certificates", {
    bundleId: req.params.id,
  });
});
router.get("/course-bundle/details/:id/reviews", (req, res) =>
  res.render("creator/course-bundle/details/reviews", {
    bundleId: req.params.id,
  })
);
router.get("/course-bundle/details/:id/learners", (req, res) =>
  res.render("creator/course-bundle/details/learners", {
    bundleId: req.params.id,
  })
);

export default router;
