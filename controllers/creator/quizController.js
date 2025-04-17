import slugify from "slugify";
import { catchAsyncError } from "../../middleWares/catchAsyncError.js";
import { Quiz } from "../../models/Quiz.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { QuizQuestions } from "../../models/QuizQuestions.js";
import moment from "moment";
import XLSX from "xlsx";
import { sortQuizQuestionsByNumber } from "../../utils/dataWatcher.js";
import mongoose from "mongoose";

// Quiz
export const addQuiz = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const { courseId } = req.params;
  if (!title || !description) {
    return next(new ErrorHandler("All fields are required.", 422));
  }

  await Quiz.create({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    course: courseId,
    title,
    description,
    slug: slugify(title, { lower: true }),
  });
  req.flash("success", "Quiz created successfully.");
  res.redirect(`/api/creator/quiz/${courseId}/list`);
});
export const getAllQuiz = catchAsyncError(async (req, res, next) => {
  let query = {
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    course: new mongoose.Types.ObjectId(req.params.courseId),
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

  const quizzes = await Quiz.aggregate(aggregateQuery);

  sendResponse(req, res, "creator/quiz/course-quiz", {
    quizzes: quizzes[0].data,
    total: quizzes[0].metadata[0]
      ? Math.ceil(quizzes[0].metadata[0].total / limit)
      : 0,
    page,
    perPage: limit,
    search: search ? search : "",
    moment,
    courseId: req.params.courseId,
  });
});
export const editQuiz = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  const { courseId, id } = req.params;

  if (!title || !description) {
    return next(new ErrorHandler("All fields are required.", 422));
  }

  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new ErrorHandler("Quiz not found.", 404));

  await Quiz.findByIdAndUpdate(
    { _id: id },
    {
      title,
      slug: slugify(title, { lower: true }),
      description,
    }
  );

  req.flash("success", "Quiz updated successfully.");
  res.redirect(`/api/creator/quiz/${courseId}/list`);
});
export const deleteQuiz = catchAsyncError(async (req, res, next) => {
  const { courseId, id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new ErrorHandler("Quiz not found.", 404));

  quiz.deleted = true;
  await quiz.save();

  req.flash("success", "Quiz deleted successfully.");
  res.redirect(`/api/creator/quiz/${courseId}/list`);
});
export const AllDeletedQuiz = catchAsyncError(async (req, res, next) => {
  const quizzes = await Quiz.find({
    creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
    course: req.params.courseId,
    deleted: true,
  });

  res.status(200).json({
    success: true,
    quizzes,
  });
});
export const restoreQuiz = catchAsyncError(async (req, res, next) => {
  const { courseId, id } = req.params;

  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new ErrorHandler("Quiz not found.", 404));

  quiz.deleted = false;
  await quiz.save();

  req.flash("success", "Quiz deleted successfully.");
  res.redirect(`/api/creator/quiz/${courseId}/list`);
});

// Quiz questions
export const addQuizQuestion = catchAsyncError(async (req, res, next) => {
  const { quizId } = req.params;
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

  let quizQuestion = await QuizQuestions.findOne({
    quizType: quizId,
    deleted: false,
    type: "quiz",
  });

  if (!quizQuestion) {
    quizQuestion = await QuizQuestions.create({
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      quizType: quizId,
      type: "quiz",
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

  let updatedQuizQuestion = await QuizQuestions.findByIdAndUpdate(
    { _id: quizQuestion._id },
    {
      $push: { items: _item },
    }
  );

  await updatedQuizQuestion.save();
  await sortQuizQuestionsByNumber(updatedQuizQuestion._id);

  req.flash("success", "Question added successfully.");
  res.redirect(`/api/creator/quiz/${quizId}/question/list`);
});
export const getAllQuizQuestions = catchAsyncError(async (req, res, next) => {
  let query = {
    quizType: new mongoose.Types.ObjectId(req.params.quizId),
    deleted: "false",
    type: "quiz",
  };
  let limit = parseInt(req.query.perPage) || 10;
  let page = req.query.page ? Number(req.query.page) - 1 : 0;
  let start = Number(page) * (req.query.perPage ? req.query.perPage : 10);

  const quizQuestions = await QuizQuestions.aggregate([
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
  const { course } = await Quiz.findById(req.params.quizId);

  sendResponse(req, res, "creator/quiz/course-questions", {
    quizQuestions: quizQuestions[0],
    total: quizQuestions[0] ? Math.ceil(quizQuestions[0].total / limit) : 0,
    quizId: req.params.quizId,
    courseId: course,
    page: req.query.page ? req.query.page : 1,
    perPage: limit,
  });
});
export const editQuizQuestion = catchAsyncError(async (req, res, next) => {
  const { quizId, quizQuestionId } = req.params;
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

  const quizQuestion = await QuizQuestions.findById(quizQuestionId);
  if (!quizQuestion) return next(new ErrorHandler("Question no found", 404));

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

  quizQuestion.items[req.query.questionNumber] = _item;

  await quizQuestion.save();
  await sortQuizQuestionsByNumber(quizQuestion._id);

  req.flash("success", "Question updated successfully.");
  res.redirect(`/api/creator/quiz/${quizId}/question/list`);
});
export const deleteQuizQuestion = catchAsyncError(async (req, res, next) => {
  const { quizId, quizQuestionId } = req.params;
  const quizQuestion = await QuizQuestions.findById(quizQuestionId);

  if (!quizQuestion)
    return next(new ErrorHandler("Quiz question no found", 404));

  await QuizQuestions.updateOne(
    { _id: quizQuestionId },
    { $pull: { items: { _id: req.query.questionId } } }
  );

  // update count (pending)

  req.flash("success", "Question deleted successfully.");
  res.redirect(`/api/creator/quiz/${quizId}/question/list`);
});
export const importQuizQuestions = catchAsyncError(async (req, res, next) => {
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
    quizType: req.params.quizId,
  });

  if (!quizQuestion) {
    quizQuestion = await QuizQuestions.create({
      creator: req.user.role === "creator" ? req.user._id : req.user.createdBy,
      quizType: req.params.quizId,
      type: "quiz",
    });
  }

  quizQuestion.items = quizQuestion.items.concat(questionsList);

  const savedQuestion = await quizQuestion.save();
  await sortQuizQuestionsByNumber(quizQuestion._id);

  await Quiz.findByIdAndUpdate(req.params.quizId, {
    noOfQuestions: savedQuestion.items.length,
  });

  req.flash("success", "Questions imported successfully.");
  res.redirect(`/api/creator/quiz/${req.params.quizId}/question/list`);
});
