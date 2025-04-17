import { Topic } from "../models/Topic.js";
import { Course } from "../models/Course.js";
import { convertSecondsToDuration } from "./videoDuration.js";
import { CourseBundle } from "../models/CourseBundle.js";
import { QuizQuestions } from "../models/QuizQuestions.js";
import { Quiz } from "../models/Quiz.js";
import { Diploma } from "../models/Diploma.js";

export const updateLessonCountAndDuration = async (courseId, topicId) => {
  try {
    const course = await Course.findById(courseId);
    const topic = await Topic.findById(topicId);

    // update lesson duration in topic
    let totalLessonDuration = 0;
    topic.lessons.forEach((lesson) => {
      if (lesson.duration.totalSeconds) {
        totalLessonDuration += lesson.duration.totalSeconds;
      }
    });
    topic.totalDuration = convertSecondsToDuration(totalLessonDuration);
    await topic.save();

    // Update lesson count in course
    const totalTopicsCountInCourse = await Topic.countDocuments({
      deleted: false,
      course: courseId,
    });
    course.totalLessons = totalTopicsCountInCourse;

    // update lesson duration in course
    const totalTopicsInCourse = await Topic.find({
      deleted: false,
      course: courseId,
    });
    let totalTopicDuration = 0;
    totalTopicsInCourse.forEach((topic) => {
      if (topic.totalDuration.totalSeconds) {
        totalTopicDuration += topic.totalDuration.totalSeconds;
      }
    });
    course.duration = convertSecondsToDuration(totalTopicDuration);

    await course.save();
  } catch (error) {
    console.log(error);
  }
};

export const updateBundleDuration = async (bundleId, courses) => {
  try {
    if (!Array.isArray(courses)) {
      courses = [courses];
    }

    let totalDuration = 0;
    courses.forEach(async (course) => {
      let {
        duration: { totalSeconds },
      } = await Course.findById(course);
      if (totalSeconds) {
        totalDuration += totalSeconds;
      }
    });
    setTimeout(async () => {
      await CourseBundle.findByIdAndUpdate(bundleId, {
        duration: convertSecondsToDuration(totalDuration),
      });
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};

export const sortQuizQuestionsByNumber = async (id) => {
  const quizQuestion = await QuizQuestions.findById(id);
  if (quizQuestion.items.length > 0) {
    quizQuestion.items = quizQuestion.items.sort((a, b) => {
      if (a.noOfQuestion < b.noOfQuestion) {
        return -1;
      }
      if (a.noOfQuestion > b.noOfQuestion) {
        return 1;
      }
      return 0;
    });
  }

  if (quizQuestion.type === "quiz") {
    const quiz = await Quiz.findById(quizQuestion.quizType);
    quiz.noOfQuestions = quizQuestion.items.length;
    await quiz.save();
  }
  if (quizQuestion.type === "diploma") {
    const diploma = await Diploma.findById(quizQuestion.quizType);
    diploma.noOfQuestions = quizQuestion.items.length;
    await diploma.save();
  }

  await quizQuestion.save();
  return;
};
