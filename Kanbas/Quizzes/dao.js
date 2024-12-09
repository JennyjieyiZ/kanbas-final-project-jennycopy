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

export async function getQuizzesByCourse(courseId, sort) {
    let sortParams = {};
    if (sort) {
        const [field, order] = sort.split('_');
        sortParams[field] = order === 'desc' ? -1 : 1;
    }
    return model.find({ courseId }).sort(sortParams);
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

export async function copyQuiz(quizId, targetCourseId) {
    try {
        // Fetch the original quiz
        const originalQuiz = await model.findById(quizId).populate('questions');
        if (!originalQuiz) {
            throw new Error('Quiz not found');
        }

        // Prepare the copied quiz data
        const copiedQuizData = {
            title: `${originalQuiz.title} (Copy)`, // Append "(Copy)" to the title
            description: originalQuiz.description,
            courseId: targetCourseId, // Associate with the target course
            createdBy: originalQuiz.createdBy,
            settings: { ...originalQuiz.settings },
            points: originalQuiz.points,
            published: false, 
            questions: [...originalQuiz.questions], // Copy questions
            dueDate: originalQuiz.dueDate,
            availableFrom: originalQuiz.availableFrom,
            availableUntil: originalQuiz.availableUntil,
        };

        // Save the new quiz to the database
        const copiedQuiz = new model(copiedQuizData);
        return await copiedQuiz.save();
    } catch (error) {
        console.error("Error copying quiz:", error);
        throw new Error("Failed to copy quiz");
    }
}