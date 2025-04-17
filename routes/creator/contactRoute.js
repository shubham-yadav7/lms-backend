import express from "express";
import {
  addContact,
  deleteContact,
  getAllContacts,
} from "../../controllers/creator/contactController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("contact"), addContact);
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("contact"), getAllContacts);
router
  .route("/:id")
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("contact"),
    deleteContact
  );

export default router;
