import model from "./model.js";
import * as attemptDao from "../Attempt/dao.js";

export function createQuiz(courseId, quizData) {
    try {
        delete quizData._id; // 删除不合法的 _id
        const quiz = new model({
            ...quizData,
            courseId,
        });
    return quiz.save(); }
    catch (error) {
        console.error("Error creating quiz:", error);
        throw new Error("Failed to create quiz");
    }
}

export async function getQuizzesByCourse(courseId) {
    return model.find({ courseId });
}

export async function getQuizById(quizId) {
    return model.findById(quizId).populate('questions');
}

export async function updateQuiz(quizId, quizData) {
    return model.findByIdAndUpdate(quizId, quizData, { new: true });
}

export async function deleteQuiz(quizId) {
    return model.findByIdAndDelete(quizId);
}

export async function togglePublishQuiz(quizId) {
    const quiz = await model.findById(quizId).populate('questions');
    quiz.published = !quiz.published;
    return quiz.save();
}