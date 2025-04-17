import express from "express";
import upload from "../../middleWares/uploads.js";
import {
  addHelp,
  addHelpFile,
  deleteHelp,
  deleteHelpFile,
  editHelp,
  getAllHelp,
} from "../../controllers/creator/helpController.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("help"), upload, addHelp);
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("help"), getAllHelp);
router
  .route("/add-help-file")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("help"),
    upload,
    addHelpFile
  );
router
  .route("/delete-help-file/:image")
  .delete(authorizedCreator, checkCreatorsModuleAccess("help"), deleteHelpFile);
router
  .route("/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("help"), upload, editHelp)
  .delete(authorizedCreator, checkCreatorsModuleAccess("help"), deleteHelp);

export default router;
