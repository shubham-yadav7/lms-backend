import slugify from "slugify";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { ProductCategory } from "../../models/ProductCategory.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { Product } from "../../models/Product.js";
import { CourseLanguage } from "../../models/CourseLanguage.js";
import moment from "moment";
import {
  status,
  modules,
  couponType,
  courseLevels,
  courseAccess,
} from "../../utils/presetData.js";
import fs from "fs";
import mongoose from "mongoose";

// Product Category
export const addProductCategory = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 422));
  let category = await ProductCategory.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
  });

  if (req.query && req.query.type === "autoset") {
    return res.status(200).json({
      success: true,
      category: category._id,
    });
  }

  req.flash("success", "Product category created successfully.");
  res.redirect("/api/creator/product/category/list");
});
export const getAllProductCategories = catchAsyncError(
  async (req, res, next) => {
    let query = {
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      deleted: false,
    };
    let limit = parseInt(req.query.perPage) || 10;
    let page = req.query.page ? req.query.page : 1;
    let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
    let sort = req.query.sort ? {} : { createdAt: -1 };
    let search = req.query.search;

    if (search) {
      let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const regex = new RegExp(newSearchQuery, "gi");
      query.$or = [
        {
          title: regex,
        },
      ];
    }

    let aggregateQuery = [
      {
        $match: query,
      },
      {
        $sort: sort,
      },
      {
        $facet: {
          data: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          metadata: [
            {
              $match: query,
            },
            {
              $count: "total",
            },
          ],
        },
      },
    ];

    const productCategories = await ProductCategory.aggregate(aggregateQuery);

    sendResponse(req, res, "creator/product/category/product-category", {
      productCategories: productCategories[0].data,
      total: productCategories[0].metadata[0]
        ? Math.ceil(productCategories[0].metadata[0].total / limit)
        : 0,
      page,
      perPage: limit,
      search: search ? search : "",
    });
  }
);
export const editProductCategory = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;

  if (!title) return next(new ErrorHandler("Title is required", 422));

  const productCategory = await ProductCategory.findById(req.params.id);
  if (!productCategory)
    return next(new ErrorHandler("Product category not found.", 404));
  productCategory.title = title;
  productCategory.slug = slugify(title, { lower: true });
  await productCategory.save();

  req.flash("success", "Product category updated successfully.");
  res.redirect("/api/creator/product/category/list");
});
export const deleteProductCategory = catchAsyncError(async (req, res, next) => {
  const productCategory = await ProductCategory.findById(req.params.id);
  if (!productCategory)
    return next(new ErrorHandler("Product category not found.", 404));

  productCategory.deleted = true;

  await productCategory.save();
  req.flash("success", "Product category deleted successfully.");
  res.redirect("/api/creator/product/category/list");
});

// Product
export const addProduct = catchAsyncError(async (req, res, next) => {
  const {
    skuNumber,
    title,
    excerpt,
    price,
    discountedPrice,
    levels,
    language,
    category,
  } = req.body;

  if (
    !skuNumber ||
    !title ||
    !excerpt ||
    !price ||
    !discountedPrice ||
    !levels ||
    !language ||
    !category
  ) {
    return next(new ErrorHandler("All fields are required", 422));
  }

  if (Number(price) < Number(discountedPrice)) {
    return next(
      new ErrorHandler("Discounted price must be less than actual price.", 422)
    );
  }

  await Product.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
    excerpt,
    price,
    discountedPrice,
    levels,
    language,
    category,
    SKU: skuNumber,
  });

  req.flash("success", "Product created successfully.");
  res.redirect("/api/creator/product/list");
});
export const getAllProducts = catchAsyncError(async (req, res, next) => {
  let _creator;
  const responseType = req.accepts(["html", "json"]);
  if (responseType === "html") {
    _creator = req.user.role === "creator" ? req.user._id : req.user.createdBy;
  } else if (responseType === "json") {
    _creator = req.creatorInfo._id;
  }

  let query = {
    creator: _creator,
    deleted: false,
  };

  if (req.query.type === "learner") {
    query.status = true;
  }

  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;

  if (req.query.sort) {
    let a = req.query.sort.split("_");
    sort[a[0]] = Number(a[1]);
  }

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        title: regex,
      },
      {
        excerpt: regex,
      },
      {
        description: regex,
      },
    ];
  }

  if (req.query.filter) {
    switch (req.query.filter) {
      case "active":
        query.status = true;
        break;
      case "inactive":
        query.status = false;
        query.publishStatus = false;
        break;
      case "unpublished":
        query.status = false;
        query.publishStatus = true;
    }
  }

  if (req.query.languages) {
    let _lang = req.query.languages
      .split(",")
      .map((lang) => new mongoose.Types.ObjectId(lang));
    query.language = { $in: _lang };
  }

  if (req.query.categories) {
    let _cat = req.query.categories
      .split(",")
      .map((cat) => new mongoose.Types.ObjectId(cat));
    query.category = { $in: _cat };
  }

  if (req.query.levels) {
    query.levels = { $in: req.query.levels.split(",") };
  }

  if (req.query.price) {
    switch (req.query.price) {
      case "all": {
        break;
      }
      case "free": {
        query.discountedPrice = 0;
        break;
      }
      case "paid": {
        query.discountedPrice = { $gt: 0 };
        break;
      }
      default: {
        return next(new ErrorHandler("Please select valid price option.", 422));
      }
    }
  }

  if (req.query.rating) {
    query.averageRating = {
      $gte: Number(req.query.rating),
      $lt: Number(req.query.rating) + 1,
    };
  }

  let aggregateQuery = [
    {
      $match: query,
    },
    {
      $lookup: {
        from: "courselanguages",
        localField: "language",
        foreignField: "_id",
        as: "language",
      },
    },
    {
      $lookup: {
        from: "productcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: sort,
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        metadata: [
          {
            $match: query,
          },
          {
            $count: "total",
          },
        ],
      },
    },
  ];

  const courseLanguages = await CourseLanguage.find({
    creator: _creator,
    deleted: false,
  });

  const productCategories = await ProductCategory.find({
    creator: _creator,
    deleted: false,
  });

  const products = await Product.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/product/product-list", {
    products: products[0].data,
    total: products[0].metadata[0]
      ? Math.ceil(products[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    courseLanguages,
    productCategories,
    courseLevels,
    moment,
    totalProducts: products[0].metadata[0] ? products[0].metadata[0].total : 0,
  });
});
export const editProductDetailsPage = catchAsyncError(
  async (req, res, next) => {
    const courseLanguages = await CourseLanguage.find({
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      deleted: false,
    });

    const productCategories = await ProductCategory.find({
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      deleted: false,
    });

    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler("Product not found", 404));

    res.render("creator/product/product-view", {
      product,
      courseLanguages,
      productCategories,
      courseLevels,
    });
  }
);
export const editProduct = catchAsyncError(async (req, res, next) => {
  const { type } = req.query;
  const {
    skuNumber,
    title,
    category,
    excerpt,
    levels,
    language,
    price,
    discountedPrice,
    quantityInStock,
    HSN,

    description,
    thumbnailVideo,
    // instructor,
    benefits,

    slug,
    seoTitle,
    seoDescription,
    seoScripts,

    status,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found.", 404));

  let _productGallery = [];
  let _product = {};
  let message;

  switch (type) {
    case "basic-info": {
      if (
        !skuNumber ||
        !title ||
        !category ||
        !excerpt ||
        levels.length === 0 ||
        language.length === 0 ||
        !price ||
        !discountedPrice ||
        !quantityInStock ||
        !HSN
      ) {
        return next(new ErrorHandler("All fields are required.", 422));
      }

      _product.SKU = skuNumber;
      _product.title = title;
      _product.slug = slugify(title, { lower: true });
      _product.category = category;
      _product.excerpt = excerpt;
      _product.levels = levels;
      _product.language = language;
      _product.price = price;
      _product.discountedPrice = discountedPrice;
      _product.quantityInStock = quantityInStock;
      _product.HSN = HSN;

      message = "Product's basic details updated successfully.";
      break;
    }
    case "description-info": {
      if (!description) {
        return next(new ErrorHandler("Description is required", 422));
      }

      _product.description = description;
      _product.thumbnailVideo = thumbnailVideo;
      _product.benefits = benefits.split("|");

      if (req.files.thumbnail) {
        if (product.thumbnailImage) {
          if (
            fs.existsSync(
              `./public/uploads/products/thumbnails/${product.thumbnail}`
            )
          ) {
            fs.unlinkSync(
              `./public/uploads/products/thumbnails/${product.thumbnail}`
            );
          }
        }
        _product.thumbnailImage = req.files.thumbnail[0].filename;
      }

      if (req.files.productGallery) {
        _productGallery = req.files.productGallery.map((img) => img.filename);
      }

      message = "Product's description details updated successfully.";
      break;
    }
    case "seo-info": {
      if (!slug) {
        return next(new ErrorHandler("product url is required.", 422));
      }

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return next(new ErrorHandler("Course url format is invalid", 422));
      }

      if (slug !== product.slug) {
        _product.slug = slugify(slug, { lower: true });
      }

      const seo = {
        title: seoTitle ? seoTitle : "",
        description: seoDescription ? seoDescription : "",
        scripts: seoScripts ? seoScripts : "",
      };

      _product.seo = seo;
      break;
    }
    case "advanced-info": {
      _product.status = status ? true : false;
      _product.publishStatus = false;
    }
  }
  await Product.findByIdAndUpdate(req.params.id, _product);
  if (_productGallery.length > 0) {
    await Product.updateOne(
      { _id: req.params.id },
      { $push: { productGallery: _productGallery } }
    );
  }
  req.flash("success", message);
  res.redirect(`/api/creator/product/${req.params.id}`);
});
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  product.deleted = true;
  await product.save();

  req.flash("success", "Product deleted successfully.");
  res.redirect("/api/creator/product/list");
});
export const allDeletedProducts = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: true,
  };
  let limit = parseInt(req.query.perPage) || 5;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 5);
  let search = req.query.search;

  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        title: regex,
      },
      {
        excerpt: regex,
      },
      {
        description: regex,
      },
    ];
  }

  let aggregateQuery = [
    {
      $match: query,
    },
    {
      $lookup: {
        from: "courselanguages",
        localField: "language",
        foreignField: "_id",
        as: "language",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products",
        foreignField: "_id",
        as: "products",
      },
    },
    {
      $lookup: {
        from: "productcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $facet: {
        data: [
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ],
        metadata: [
          {
            $match: query,
          },
          {
            $count: "total",
          },
        ],
      },
    },
  ];

  const products = await Product.aggregate(aggregateQuery);

  res.render("creator/product/product-deleted", {
    products: products[0].data,
    total: products[0].metadata[0]
      ? Math.ceil(products[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
export const restoreProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  product.deleted = false;
  await product.save();

  req.flash("success", "Product restore successfully");
  res.redirect("/api/creator/product/list");
});
export const deleteProductGalleryImage = catchAsyncError(
  async (req, res, next) => {
    const { id, filename } = req.params;

    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Product not found", 404));

    if (fs.existsSync(`./public/uploads/products/gallery/${filename}`)) {
      fs.unlinkSync(`./public/uploads/products/gallery/${filename}`);
    }

    await Product.updateOne(
      { _id: id },
      { $pull: { productGallery: filename } }
    );

    res.status(200).json("Image deleted successfully.");
  }
);
export const getProductBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;

  let query = {
    creator: new mongoose.Types.ObjectId(req.creatorInfo._id),
    deleted: false,
    status: true,
    slug,
  };

  let aggregateQuery = [
    {
      $match: query,
    },
    {
      $lookup: {
        from: "courselanguages",
        localField: "language",
        foreignField: "_id",
        as: "language",
      },
    },
    {
      $lookup: {
        from: "productcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "creators",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $set: {
        creator: { $arrayElemAt: ["$creator.brandName", 0] },
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "ratings",
        foreignField: "_id",
        as: "ratings",
      },
    },
  ];

  const product = await Product.aggregate(aggregateQuery);

  res.status(200).json({
    success: true,
    product: product[0],
  });
});
