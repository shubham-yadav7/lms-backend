import express from "express";
import {
  deleteNewsLetter,
  getAllNewsLetter,
} from "../../controllers/creator/newsLetterController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("contact"),
    getAllNewsLetter
  );
router
  .route("/:id")
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("contact"),
    deleteNewsLetter
  );

export default router;
