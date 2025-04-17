import slugify from "slugify";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Diploma } from "../../models/Diploma.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { QuizQuestions } from "../../models/QuizQuestions.js";
import { sortQuizQuestionsByNumber } from "../../utils/dataWatcher.js";
import XLSX from "xlsx";
import mongoose from "mongoose";

export const addDiploma = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const { bundleId } = req.params;

  if (!title || !description) {
    return next(new ErrorHandler("All fields are required.", 422));
  }
  await Diploma.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    courseBundle: bundleId,
    title,
    slug: slugify(title, { lower: true }),
    description,
  });

  req.flash("success", "Diploma created successfully.");
  res.redirect(`/api/creator/diploma/${bundleId}/list`);
});
export const getAllDiplomas = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    courseBundle: new mongoose.Types.ObjectId(req.params.bundleId),
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
  const diplomas = await Diploma.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/diploma/course-bundle-diploma", {
    diplomas: diplomas[0].data,
    bundleId: req.params.bundleId,
    total: diplomas[0].metadata[0]
      ? Math.ceil(diplomas[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
  });
});
export const editDiploma = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const { bundleId, id } = req.params;

  if (!title || !description) {
    return next(new ErrorHandler("All fields are required.", 422));
  }

  const diploma = await Diploma.findById(id);
  if (!diploma) return next(new ErrorHandler("Diploma not found.", 404));

  await Diploma.findByIdAndUpdate(
    { _id: id },
    {
      title,
      slug: slugify(title, { lower: true }),
      description,
    }
  );

  req.flash("success", "Diploma updated successfully.");
  res.redirect(`/api/creator/diploma/${bundleId}/list`);
});
export const deleteDiploma = catchAsyncError(async (req, res, next) => {
  const { bundleId, id } = req.params;

  const diploma = await Diploma.findById(id);
  if (!diploma) return next(new ErrorHandler("Diploma not found.", 404));

  diploma.deleted = true;
  await diploma.save();

  req.flash("success", "Diploma deleted successfully.");
  res.redirect(`/api/creator/diploma/${bundleId}/list`);
});
export const AllDeletedDiplomas = catchAsyncError(async (req, res, next) => {
  const diplomas = await Diploma.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    courseBundle: req.params.bundleId,
    deleted: true,
  });

  res.status(200).json({
    success: true,
    diplomas,
  });

  // res.redirect('', {diplomas})
});
export const restoreDiploma = catchAsyncError(async (req, res, next) => {
  const { bundleId, id } = req.params;

  const diploma = await Diploma.findById(id);
  if (!diploma) return next(new ErrorHandler("Diploma not found.", 404));

  diploma.deleted = false;
  await diploma.save();

  req.flash("success", "Diploma deleted successfully.");
  res.redirect(`/api/creator/diploma/${bundleId}/list`);
});

export const addDiplomaQuestion = catchAsyncError(async (req, res, next) => {
  const { diplomaId } = req.params;
  const {
    questionNumber,
    typeOfQuestion,
    question,
    optionOne,
    optionTwo,
    optionThree,
    optionFour,
    answer,
  } = req.body;

  if (!typeOfQuestion) {
    return next(new ErrorHandler("Please select question type", 422));
  }

  let diplomaQuestion = await QuizQuestions.findOne({
    quizType: diplomaId,
    type: "diploma",
    deleted: false,
  });

  if (!diplomaQuestion) {
    diplomaQuestion = await QuizQuestions.create({
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      quizType: diplomaId,
      type: "diploma",
    });
  }

  let _item = {};

  switch (typeOfQuestion) {
    case "singleSelect": {
      if (
        !questionNumber ||
        !typeOfQuestion ||
        !question ||
        !optionOne ||
        !optionTwo ||
        !optionThree ||
        !optionFour ||
        !answer
      ) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      let _opt = [optionOne, optionTwo, optionThree, optionFour];
      _opt = _opt.filter((op) => op);

      _item = {
        questionNumber,
        typeOfQuestion,
        question,
        choice: _opt,
        singleSelect: answer,
      };

      break;
    }
    case "multiSelect": {
      if (
        !questionNumber ||
        !typeOfQuestion ||
        !question ||
        !optionOne ||
        !optionTwo ||
        !optionThree ||
        !optionFour ||
        !answer
      ) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      let _opt = [optionOne, optionTwo, optionThree, optionFour];
      _opt = _opt.filter((op) => op);

      _item = {
        questionNumber,
        typeOfQuestion,
        question,
        choice: _opt,
        multiSelect: answer,
      };

      break;
    }
    case "yesOrNo": {
      if (!questionNumber || !typeOfQuestion || !question || !answer) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      _item = {
        questionNumber,
        typeOfQuestion,
        question,
        yesOrNo: answer === "true",
      };

      break;
    }
    default: {
      return next(new ErrorHandler("Please select question type", 422));
    }
  }

  let updatedDiplomaQuestions = await QuizQuestions.findByIdAndUpdate(
    { _id: diplomaQuestion._id },
    {
      $push: { items: _item },
    }
  );

  await updatedDiplomaQuestions.save();
  await sortQuizQuestionsByNumber(updatedDiplomaQuestions._id);

  req.flash("success", "Diploma question added successfully");
  res.redirect(`/api/creator/diploma/${diplomaId}/question/list`);
});
export const getAllDiplomaQuestions = catchAsyncError(
  async (req, res, next) => {
    const { diplomaId } = req.params;

    let query = {
      quizType: new mongoose.Types.ObjectId(diplomaId),
      type: "diploma",
      deleted: "false",
    };
    let limit = parseInt(req.query.perPage) || 10;
    let page = req.query.page ? Number(req.query.page) - 1 : 0;
    let start = Number(page) * (req.query.perPage ? req.query.perPage : 10);

    const diplomaQuestions = await QuizQuestions.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          total: { $size: "$items" },
          items: { $slice: ["$items", start, limit] },
        },
      },
    ]);

    const diploma = await Diploma.findById(diplomaId).select("courseBundle");

    sendResponse(req, res, "creator/diploma/quiz", {
      diplomaQuestions: diplomaQuestions[0],
      total: diplomaQuestions[0]
        ? Math.ceil(diplomaQuestions[0].total / limit)
        : 0,
      bundleId: diploma.courseBundle,
      diplomaId,
      page: req.query.page ? req.query.page : 1,
      perPage: limit,
    });
  }
);
export const editDiplomaQuestion = catchAsyncError(async (req, res, next) => {
  const { diplomaId, quizId } = req.params;
  const {
    questionNumber,
    typeOfQuestion,
    question,
    optionOne,
    optionTwo,
    optionThree,
    optionFour,
    answer,
  } = req.body;

  if (!typeOfQuestion) {
    return next(new ErrorHandler("Please select question type", 422));
  }

  const diplomaQuestion = await QuizQuestions.findById(quizId);
  if (!diplomaQuestion)
    return next(new ErrorHandler("diploma question no found", 404));

  let _item = {};

  switch (typeOfQuestion) {
    case "singleSelect": {
      if (
        !questionNumber ||
        !typeOfQuestion ||
        !question ||
        !optionOne ||
        !optionTwo ||
        !optionThree ||
        !optionFour ||
        !answer
      ) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      let _opt = [optionOne, optionTwo, optionThree, optionFour];
      _opt = _opt.filter((op) => op);

      _item = {
        questionNumber,
        typeOfQuestion,
        question,
        choice: _opt,
        singleSelect: answer,
      };

      break;
    }
    case "multiSelect": {
      if (
        !questionNumber ||
        !typeOfQuestion ||
        !question ||
        !optionOne ||
        !optionTwo ||
        !optionThree ||
        !optionFour ||
        !answer
      ) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      let _opt = [optionOne, optionTwo, optionThree, optionFour];
      _opt = _opt.filter((op) => op);

      _item = {
        questionNumber,
        typeOfQuestion,
        question,
        choice: _opt,
        multiSelect: answer,
      };

      break;
    }
    case "yesOrNo": {
      if (!questionNumber || !typeOfQuestion || !question || !answer) {
        return next(new ErrorHandler("All fields are required", 422));
      }

      _item = {
        questionNumber,
        typeOfQuestion,
        question,
        yesOrNo: answer === "true",
      };

      break;
    }
    default: {
      return next(new ErrorHandler("Please select question type", 422));
    }
  }

  diplomaQuestion.items[req.query.questionNumber] = _item;
  await diplomaQuestion.save();
  await sortQuizQuestionsByNumber(diplomaQuestion._id);

  req.flash("success", "Diploma question updated successfully.");
  res.redirect(`/api/creator/diploma/${diplomaId}/question/list`);
});
export const deleteDiplomaQuestion = catchAsyncError(async (req, res, next) => {
  const { diplomaId, quizId } = req.params;

  const diplomaQuestion = await QuizQuestions.findById(quizId);

  if (!diplomaQuestion) return next(new ErrorHandler("Question no found", 404));

  await QuizQuestions.updateOne(
    {
      _id: quizId,
    },
    {
      $pull: { items: { _id: req.query.questionId } },
    }
  );

  // update count (pending)

  req.flash("success", "Diploma question deleted successfully");
  res.redirect(`/api/creator/diploma/${diplomaId}/question/list`);
});
export const importDiplomaQuestions = catchAsyncError(
  async (req, res, next) => {
    const workbook = XLSX.readFile(req.files.quizSheet[0].path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    let data = XLSX.utils.sheet_to_json(workSheet, { header: 1 });

    let questionsList = [];

    for (let i = 1; i < data.length; i++) {
      if (data[i][1]) {
        let quesData = {
          questionNumber: data[i][0],
          typeOfQuestion: data[i][1],
          question: data[i][2],
          choice:
            data[i][1] !== "yesOrNo"
              ? [data[i][3], data[i][4], data[i][5], data[i][6]]
              : [],
        };
        if (data[i][1] === "singleSelect") {
          quesData.singleSelect = data[i][7].trim();
        }
        if (data[i][1] === "multiSelect") {
          quesData.multiSelect = data[i][7]
            .split(",")
            .map(Function.prototype.call, String.prototype.trim);
        }
        if (data[i][1] === "yesOrNo") {
          quesData.yesOrNo = data[i][7] === "true";
        }
        questionsList.push(quesData);
      }
    }

    let quizQuestion = await QuizQuestions.findOne({
      quizType: req.params.diplomaId,
    });

    if (!quizQuestion) {
      quizQuestion = await QuizQuestions.create({
        creator:
          req.user.role === "creator" ? req.user._id : req.user.createdBy,
        quizType: req.params.diplomaId,
        type: "diploma",
      });
    }

    quizQuestion.items = quizQuestion.items.concat(questionsList);
    const savedQuestion = await quizQuestion.save();
    await sortQuizQuestionsByNumber(quizQuestion._id);

    await Diploma.findByIdAndUpdate(req.params.diplomaId, {
      noOfQuestions: savedQuestion.items.length,
    });

    req.flash("success", "Questions imported successfully.");
    res.redirect(`/api/creator/diploma/${req.params.diplomaId}/question/list`);
  }
);
