import model from "./model.js";
import QuizModel from "../Quizzes/model.js"
import {getQuestionsForQuiz} from "../Questions/dao.js";

export async function getPopulatedAttempt(attemptId) {
    try {
        const populatedAttempt = await model
            .findById(attemptId)
            .populate({
                path: 'quizId', // 填充测验信息
                model: 'QuizModel',
            })
            .populate({
                path: 'answers.questionId',
                model: 'QuestionModel',
            });
        return populatedAttempt;
    } catch (error) {
        console.error('Error fetching populated attempt:', error);
        throw error;
    }
}

export async function startAttempt(quizId, studentId) {

    const questions = await getQuestionsForQuiz(quizId)
    const answers = questions.map((question) => ({
        questionId: question._id,
        answer: '', // 初始化为空字符串，等待学生作答
        isCorrect: false, // 默认 false，等待判分
    }));

    const previousAttempts = await model.countDocuments({ quizId, studentId });
    const attempt = new model({
        quizId,
        studentId,
        attemptNumber: previousAttempts + 1,
        answers,
    });
    return attempt.save();
}

export async function submitAttempt(attemptId, answers) {
    // 查找尝试记录并填充关联的 Question 数据
    const attempt = await model
        .findById(attemptId)
        .populate({
            path: 'answers.questionId',
            model: 'QuestionModel',
        });

    if (!attempt) {
        throw new Error('Attempt not found');
    }

    const enhancedAnswers = answers.map(answer => {


        const question = attempt.answers.find(a => {
            const answerId = typeof answer.questionId === 'string' ? answer.questionId : answer.questionId._id.toString();
            const attemptId = typeof a.questionId === 'string' ? a.questionId : a.questionId._id.toString();
            return answerId === attemptId;
        })?.questionId;
        if (question) {
            const isCorrect = checkCorrectness(answer.answer, question);
            return {
                ...answer,
                isCorrect,
                points: isCorrect ? question.points : 0, // 正确答案获得分数
            };
        }

        return { ...answer, isCorrect: false, points: 0 }; // 未找到问题时默认错误
    });

    // 更新尝试记录
    attempt.answers = enhancedAnswers;
    attempt.score = calculateScore(enhancedAnswers);
    attempt.dateAttempted = new Date();

    return attempt.save();
}

export async function getAttemptsByQuizAndStudent(quizId, studentId) {
    return model.find({ quizId, studentId }).populate({
        path: 'quizId', // 填充测验信息
        model: 'QuizModel',
    })
        .populate({
            path: 'answers.questionId',
            model: 'QuestionModel',
        });;
}

export async function getAttemptById(attemptId) {
    return model.findById(attemptId);
}

// Helper function to calculate score (simplified) //这个要从question获取point数据，和正确答案
function calculateScore(answers) {
    return answers.reduce((total, answer) => total + (answer.isCorrect ? answer.points : 0), 0);
}

function checkCorrectness(answer, question) {
    // 格式化字符串：去除空格并转换为小写
    const formatString = str => str.trim().toLowerCase();

    if (!answer || answer.trim() === "") {
        return false;
    }else{
        return formatString(answer) === formatString(question.correctAnswer);
    }

    // 默认返回不正确
    return false;
}