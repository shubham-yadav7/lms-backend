import express from "express";
import {
  addBlog,
  addBlogCategory,
  addBlogPage,
  addBlogTag,
  deleteBlog,
  deleteBlogCategory,
  deleteBlogDocument,
  deleteBlogGalleryImage,
  deleteBlogTag,
  editBlog,
  editBlogCategory,
  editBlogPage,
  editBlogTag,
  getAllBlog,
  getAllBlogCategories,
  getAllBlogTags,
} from "../../controllers/creator/blogController.js";
import upload from "../../middleWares/uploads.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

// Blog Category
router
  .route("/category/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("blog"), addBlogCategory);
router
  .route("/category/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("blog"),
    getAllBlogCategories
  );
router
  .route("/category/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("blog"), editBlogCategory)
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("blog"),
    deleteBlogCategory
  );

// Blog Tag
router
  .route("/tag/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("blog"), addBlogTag);
router
  .route("/tag/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("blog"), getAllBlogTags);
router
  .route("/tag/:id")
  .put(authorizedCreator, checkCreatorsModuleAccess("blog"), editBlogTag)
  .delete(authorizedCreator, checkCreatorsModuleAccess("blog"), deleteBlogTag);

// Blog
router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("blog"), upload, addBlog)
  .get(authorizedCreator, checkCreatorsModuleAccess("blog"), addBlogPage);
router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("blog"), getAllBlog);
router
  .route("/:blogId/delete-document/:id")
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("blog"),
    deleteBlogDocument
  );
router
  .route("/:blogId/delete-gallery/:filename")
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("blog"),
    deleteBlogGalleryImage
  );
router
  .route("/:id")
  .get(authorizedCreator, checkCreatorsModuleAccess("blog"), editBlogPage)
  .put(authorizedCreator, checkCreatorsModuleAccess("blog"), upload, editBlog)
  .delete(authorizedCreator, checkCreatorsModuleAccess("blog"), deleteBlog);

export default router;
