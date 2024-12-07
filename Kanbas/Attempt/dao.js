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
        console.log("get attempt) is" +  populatedAttempt);
        return populatedAttempt;
    } catch (error) {
        console.error('Error fetching populated attempt:', error);
        throw error;
    }
}

export async function startAttempt(quizId, studentId) {

    const questions = await getQuestionsForQuiz(quizId)
    console.log("create" + questions)
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

    // 增强答案数据并计算分数
    const enhancedAnswers = answers.map(answer => {
        const question = attempt.answers.find(
            a => a.questionId._id.toString() === answer.questionId
        )?.questionId;
        console.log(question)
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
    return model.find({ quizId, studentId });
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

    // 如果问题是选择题或判断题
    if (question.type === 'Multiple Choice' || question.type === 'True/False') {
        return formatString(answer) === formatString(question.correctAnswer);
    }

    // 如果问题是填空题
    else if (question.type === 'Fill in the Blank') {
        return question.correctAnswers.some(correct =>
            formatString(correct) === formatString(answer)
        );
    }

    // 默认返回不正确
    return false;
}