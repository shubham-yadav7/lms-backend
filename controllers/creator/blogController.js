import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { BlogCategory } from "../../models/BlogCategory.js";
import { Blog } from "../../models/Blog.js";
import { BlogTag } from "../../models/BlogTag.js";
import slugify from "slugify";
import moment from "moment";
import { deleteFile } from "../../utils/deleteFile.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { CourseCategory } from "../../models/CourseCategory.js";

// Blog Category
export const addBlogCategory = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  if (!title) return next(new ErrorHandler("Title is required", 422));

  const category = await BlogCategory.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
  });

  // Modal Auto set response
  if (req.query.type === "autoset") {
    return res.status(200).json({
      success: true,
      category: category._id,
    });
  }

  req.flash("success", "Blog Category Added successfully");
  res.redirect("/api/creator/blog/category/list");
});
export const getAllBlogCategories = catchAsyncError(async (req, res, next) => {
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

  const categories = await BlogCategory.aggregate(aggregateQuery);

  res.render("creator/blog/category-list", {
    categories: categories[0].data,
    total: categories[0].metadata[0]
      ? Math.ceil(categories[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  });
});
export const editBlogCategory = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  if (!title) return next(new ErrorHandler("Title is required", 422));

  const blogCategory = await BlogCategory.findById(req.params.id);
  if (!blogCategory)
    return next(new ErrorHandler("Blog Category Not Found", 404));

  blogCategory.title = title;
  blogCategory.slug = slugify(title, { lower: true });

  await blogCategory.save();

  req.flash("success", "Blog Category Updated successfully");
  res.redirect("/api/creator/blog/category/list");
});
export const deleteBlogCategory = catchAsyncError(async (req, res, next) => {
  const blogCategory = await BlogCategory.findById(req.params.id);
  if (!blogCategory)
    return next(new ErrorHandler("Blog Category Not Found", 404));

  blogCategory.deleted = true;
  await blogCategory.save();

  req.flash("success", "Blog Category Deleted successfully");
  res.redirect("/api/creator/blog/category/list");
});
export const getCategoryBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;

  const category = await BlogCategory.findOne({
    creator: req.creatorInfo._id,
    slug,
    deleted: false,
  });

  if (!category) {
    return next(new ErrorHandler("Invalid Category", 422));
  }

  res.status(200).json({
    success: true,
    category,
  });
});

// Blog Tag
export const addBlogTag = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  if (!title) return next(new ErrorHandler("Title is required", 422));

  let tag = await BlogTag.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
  });

  // Modal Auto set response
  if (req.query.type === "autoset") {
    return res.status(200).json({
      success: true,
      tag: tag._id,
    });
  }

  req.flash("success", "Blog Tag Added successfully");
  res.redirect("/api/creator/blog/tag/list");
});
export const getAllBlogTags = catchAsyncError(async (req, res, next) => {
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

  const tags = await BlogTag.aggregate(aggregateQuery);

  res.render("creator/blog/tag-list", {
    tags: tags[0].data,
    total: tags[0].metadata[0]
      ? Math.ceil(tags[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  });
});
export const editBlogTag = catchAsyncError(async (req, res, next) => {
  const { title } = req.body;
  if (!title) return next(new ErrorHandler("Title is required", 422));

  const blogTag = await BlogTag.findById(req.params.id);
  if (!blogTag) return next(new ErrorHandler("Blog Tag Not Found", 404));

  blogTag.title = title;
  blogTag.slug = slugify(title, { lower: true });

  await blogTag.save();

  req.flash("success", "Blog Tag Updated successfully");
  res.redirect("/api/creator/blog/tag/list");
});
export const deleteBlogTag = catchAsyncError(async (req, res, next) => {
  const blogTag = await BlogTag.findById(req.params.id);
  if (!blogTag) return next(new ErrorHandler("Blog Tag Not Found", 404));

  blogTag.deleted = true;
  await blogTag.save();

  req.flash("success", "Blog Tag Deleted successfully");
  res.redirect("/api/creator/blog/tag/list");
});
export const getTagBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;

  const tag = await BlogTag.findOne({
    creator: req.creatorInfo._id,
    slug,
    deleted: false,
  });

  if (!tag) {
    return next(
      new ErrorHandler("Tag is invalid,, please visit blog listing page", 422)
    );
  }

  res.status(200).json({
    success: true,
    tag,
  });
});

// Blog
export const addBlogPage = catchAsyncError(async (req, res, next) => {
  const categories = await BlogCategory.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });
  const tags = await BlogTag.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });
  res.render("creator/blog/blog-add", { categories, tags });
});
export const addBlog = catchAsyncError(async (req, res, next) => {
  const {
    title,
    quote,
    descp,
    category,
    tags,
    blogDocumentName,
    saveAsDraft,
    published,
  } = req.body;
  const { blogThumbImage, blogGallery, blogDocument } = req.files;

  let _blog = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    title,
    slug: slugify(title, { lower: true }),
    quote,
    descp,
    category,
    tags,
    saveAsDraft: saveAsDraft === "true",
    published: published === "true",
  };

  let documents = [];
  let documentName;
  if (blogDocumentName && blogDocument) {
    documentName = Array.isArray(blogDocumentName)
      ? blogDocumentName
      : [blogDocumentName];
  }

  if (documentName && documentName.length > 0) {
    documentName.forEach((doc, i) => {
      documents.push({
        name: doc,
        documentFile: blogDocument && blogDocument[0].filename,
      });
    });
  }

  if (documents.length > 0) {
    _blog.documents = documents;
  }

  if (blogThumbImage) {
    _blog.thumbImg = blogThumbImage[0].filename;
  }

  if (blogGallery) {
    _blog.gallery = blogGallery.map((img) => img.filename);
  }

  await Blog.create(_blog);
  req.flash("success", "Blog Added Successfully.");
  res.redirect("/api/creator/blog/list");
});
export const getAllBlog = catchAsyncError(async (req, res, next) => {
  const responseType = req.accepts(["html", "json"]);
  const { tag, category } = req.query;

  let query = {
    deleted: false,
  };
  // Checking response type 👇
  if (responseType === "html") {
    query.creator =
      req.user.role === "creator" ? req.user._id : req.user.createdBy;
  } else if (responseType === "json") {
    query.creator = req.creatorInfo._id;
  }

  // Search by tags
  if (tag) {
    const _tag = await BlogTag.findOne({
      creator: req.creatorInfo._id,
      slug: tag,
      deleted: false,
    }).select("_id");
    if (!_tag) {
      return next(new ErrorHandler("Please select valid tag", 422));
    }
    query.tags = {
      $elemMatch: { _id: _tag._id },
    };
  }

  // Search by category
  if (category) {
    const _category = await BlogCategory.findOne({
      creator: req.creatorInfo._id,
      slug: category,
      deleted: false,
    });
    if (!_category) {
      return next(new ErrorHandler("Please select valid category", 422));
    }
    query.category = _category;
  }

  // Pagination Query
  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? req.query.page : 1;
  let skip = (page - 1) * (req.query.perPage ? req.query.perPage : 10);
  let sort = req.query.sort ? {} : { createdAt: -1 };
  let search = req.query.search;

  // Search Query
  if (search) {
    let newSearchQuery = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(newSearchQuery, "gi");
    query.$or = [
      {
        title: regex,
      },
      {
        quote: regex,
      },
      {
        descp: regex,
      },
      {
        "category.title": regex,
      },
      {
        "tags.title": regex,
      },
    ];
  }

  let aggregateQuery = [
    {
      $lookup: {
        from: "blogcategories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "blogtags",
        localField: "tags",
        foreignField: "_id",
        as: "tags",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
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
  const blogs = await Blog.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/blog/blog-list", {
    blogs: blogs[0].data,
    total: blogs[0].metadata[0]
      ? Math.ceil(blogs[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
  });
});
export const editBlogPage = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog Not Found", 404));
  }

  const categories = await BlogCategory.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });
  const tags = await BlogTag.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    deleted: false,
  });
  res.render("creator/blog/blog-edit", { categories, tags, blog });
});
export const editBlog = catchAsyncError(async (req, res, next) => {
  const {
    title,
    quote,
    descp,
    category,
    tags,
    blogDocumentName,
    saveAsDraft,
    published,
  } = req.body;
  const { blogThumbImage, blogGallery, blogDocument } = req.files;

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog Not Found", 404));
  }

  if (title !== blog.title) {
    blog.slug = slugify(title, { lower: true });
  }
  blog.title = title;
  blog.quote = quote;
  blog.descp = descp;
  blog.category = category;
  blog.tags = tags;
  blog.saveAsDraft = saveAsDraft === "true";
  blog.published = published === "true";

  let documents = [];
  let documentName;
  if (blogDocumentName && blogDocument) {
    documentName = Array.isArray(blogDocumentName)
      ? blogDocumentName
      : [blogDocumentName];
  }

  if (documentName && documentName.length > 0) {
    documentName.forEach((doc, i) => {
      documents.push({
        name: doc,
        documentFile: blogDocument && blogDocument[0].filename,
      });
    });
  }

  if (documents.length > 0) {
    documents.forEach((doc) => blog.documents.push(doc));
  }

  if (blogThumbImage) {
    deleteFile(
      blog.thumbImg,
      `./public/uploads/blog/thumbnail/${blog.thumbImg}`
    );
    blog.thumbImg = blogThumbImage[0].filename;
  }

  let gallery = blog.gallery;
  if (blogGallery) {
    blogGallery.forEach((file) => {
      gallery.push(file.filename);
    });
  }

  blog.gallery = gallery;

  await blog.save();

  req.flash("success", "Blog Edited Successfully.");
  res.redirect(`/api/creator/blog/${blog._id}`);
});
export const deleteBlogDocument = catchAsyncError(async (req, res, next) => {
  const { blogId, id } = req.params;
  const { filename } = req.query;

  const blog = await Blog.findById(blogId);
  if (!blog) return next(new ErrorHandler("Blog not found", 404));

  deleteFile(filename, `./public/uploads/blog/documents/${filename}`);

  await Blog.updateOne({ _id: blogId }, { $pull: { documents: { _id: id } } });

  res.status(200).json("Blog Document File Deleted Successfully.");
});
export const deleteBlogGalleryImage = catchAsyncError(
  async (req, res, next) => {
    const { blogId, filename } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return next(new ErrorHandler("Blog not found", 404));

    deleteFile(filename, `./public/uploads/blog/gallery/${filename}`);

    await Blog.updateOne({ _id: blogId }, { $pull: { gallery: filename } });

    res.status(200).json("Blog Gallery Image Deleted Successfully.");
  }
);
export const deleteBlog = catchAsyncError(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new ErrorHandler("Blog Not Found", 404));
  }

  blog.deleted = true;
  await blog.save();

  req.flash("success", "Blog Deleted Successfully.");
  res.redirect("/api/creator/blog/list");
});
export const blogDetailsBySlug = catchAsyncError(async (req, res, next) => {
  const { slug } = req.params;
  let query = {
    creator: req.creatorInfo._id,
    deleted: false,
  };

  const blog = await Blog.findOne({
    creator: req.creatorInfo._id,
    slug,
  }).populate("category tags");

  const categories = await BlogCategory.find(query);
  const tags = await BlogTag.find(query);
  const courseCategories = await CourseCategory.find(query);

  res.status(200).json({
    success: true,
    blog,
    categories,
    courseCategories,
    tags,
  });
});
