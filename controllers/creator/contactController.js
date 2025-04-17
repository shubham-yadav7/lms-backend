import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Contact } from "../../models/Contact.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import moment from "moment";

export const addContact = catchAsyncError(async (req, res, next) => {
  const { name, email, number, subject, description } = req.body;

  if (!name || !email || !number) {
    return next(new ErrorHandler("Name, Email and Number are required.", 422));
  }

  const contact = await Contact.create({
    creator: req.creatorInfo._id,
    name,
    email,
    number,
    subject,
    description,
  });

  res.status(200).json({
    success: true,
    message: "Your request has been sent successfully.",
  });
});
export const getAllContacts = catchAsyncError(async (req, res, next) => {
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
        name: regex,
      },
      {
        email: regex,
      },
      {
        number: regex,
      },
      {
        subject: regex,
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

  const contacts = await Contact.aggregate(aggregateQuery);
  res.render("creator/content-management/contact-list", {
    contacts: contacts[0].data,
    total: contacts[0].metadata[0]
      ? Math.ceil(contacts[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    moment,
    search: search ? search : "",
  });
});
export const deleteContact = catchAsyncError(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return next(new ErrorHandler("Contact not found", 404));

  contact.deleted = true;
  await contact.save();
  req.flash("success", "Contact deleted successfully.");
  res.redirect("/api/creator/contact/list");
});
