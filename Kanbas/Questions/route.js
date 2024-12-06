import * as questionsDao from "./dao.js";
export default function QuestionRoutes(app){

    // Adds a new question to a quiz (Faculty only)
    app.post('/api/quizzes/:quizId/questions', async (req, res) => {
        try{
            const { quizId } = req.params;
            const questionData = req.body;
            const question = await questionsDao.addQuestionToQuiz(quizId, questionData);
            res.json(question);
        } catch (error)
        {console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: error.message });
        }
    });

// Retrieves questions for editing (Faculty only)
    app.get('/api/quizzes/:quizId/questions', async (req, res) => {
        const { quizId } = req.params;
        const questions = await questionsDao.getQuestionsForQuiz(quizId);
        res.json(questions);
    });

// Retrieves questions for taking the quiz (Students)
    app.get('/api/quizzes/:quizId/questions/student', async (req, res) => {
        const { quizId } = req.params;
        const questions = await questionsDao.getQuestionsForQuizStudent(quizId);
        res.json(questions);
    });

// Updates a question (Faculty only)
    app.put('/api/questions/:questionId', async (req, res) => {
        const { questionId } = req.params;
        const questionData = req.body;
        const updatedQuestion = await questionsDao.updateQuestion(questionId, questionData);
        res.json(updatedQuestion);
    });

// Deletes a question (Faculty only)
    app.delete('/api/questions/:questionId', async (req, res) => {
        const { questionId } = req.params;
        await questionsDao.deleteQuestion(questionId);
        res.sendStatus(204);
    });
// get a question by questionId
    app.get('/api/questions/:questionId', async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await questionsDao.getQuestionById(questionId);
            res.json(question);
        } catch (error) {
            console.error('Error fetching question:', error);
            res.status(404).json({ error: error.message });
        }
    });
}

