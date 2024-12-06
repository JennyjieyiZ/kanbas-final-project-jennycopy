import model from "./model.js";
export async function addQuestionToQuiz(quizId, questionData) {
    delete questionData._id;
    const question = new model({
        ...questionData,
        quizId,
    });
    return question.save();
} //这个你想前端处理qid逻辑也可以，注意是objectid，现在question没存入quiz,或者就不要了

export async function getQuestionsForQuiz(quizId) {
    return model.find({ quizId });
}

export async function getQuestionsForQuizStudent(quizId) {
    // Exclude correct answers when sending to students
    return model.find({ quizId }, { correctAnswer: 0, correctAnswers: 0 });
}

export async function getQuestionById(questionId) {
    try {
        const question = await model.findById(questionId);
        if (!question) {
            throw new Error(`Question with ID ${questionId} not found.`);
        }
        return question;
    } catch (error) {
        console.error("Error fetching question by ID:", error);
        throw error;
    }
}

export async function updateQuestion(questionId, questionData) {
    return model.findByIdAndUpdate(questionId, questionData, { new: true });
}

export async function deleteQuestion(questionId) {
    return model.findByIdAndDelete(questionId);
}