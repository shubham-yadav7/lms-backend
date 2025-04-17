import express from "express";
import {
  addProduct,
  addProductCategory,
  allDeletedProducts,
  deleteProduct,
  deleteProductCategory,
  editProduct,
  editProductCategory,
  editProductDetailsPage,
  getAllProductCategories,
  getAllProducts,
  restoreProduct,
  deleteProductGalleryImage,
} from "../../controllers/creator/productController.js";
import upload from "../../middleWares/uploads.js";
import {
  authorizedCreator,
  checkCreatorsModuleAccess,
} from "../../middleWares/accessAuth.js";

const router = express.Router();

// ---- Product Category Routes ---- //
router
  .route("/category/add")
  .post(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    addProductCategory
  );

router
  .route("/category/list")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    getAllProductCategories
  );

router
  .route("/category/:id")
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    editProductCategory
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    deleteProductCategory
  );

// ---- Product Routes ---- //
router
  .route("/add")
  .post(authorizedCreator, checkCreatorsModuleAccess("product"), addProduct);

router
  .route("/list")
  .get(authorizedCreator, checkCreatorsModuleAccess("product"), getAllProducts);

router
  .route("/deleted")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    allDeletedProducts
  );

router
  .route("/:id/restore-deleted-product")
  .put(authorizedCreator, checkCreatorsModuleAccess("product"), restoreProduct);

router
  .route("/:id/delete-gallery-img/:filename")
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    deleteProductGalleryImage
  );

router
  .route("/:id")
  .get(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    editProductDetailsPage
  )
  .put(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    upload,
    editProduct
  )
  .delete(
    authorizedCreator,
    checkCreatorsModuleAccess("product"),
    deleteProduct
  );

export default router;
