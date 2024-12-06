import model from "./model.js";

export function createQuiz(courseId, quizData) {
    const quiz = new model({
        ...quizData,
        courseId,
    });
    return quiz.save();
} //这个你想前端处理cid逻辑也可以，注意是objectid

export async function getQuizzesByCourse(courseId) {
    return model.find({ courseId });
}

export async function getQuizById(quizId) {
    return model.findById(quizId).populate('questions');;
}

export async function updateQuiz(quizId, quizData) {
    return model.findByIdAndUpdate(quizId, quizData, { new: true });
}

export async function deleteQuiz(quizId) {
    return model.findByIdAndDelete(quizId);
}

export async function togglePublishQuiz(quizId) {
    const quiz = await model.findById(quizId);
    quiz.published = !quiz.published;
    return quiz.save();
}