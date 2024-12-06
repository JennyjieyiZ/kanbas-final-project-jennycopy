import * as quizzesDao from "./dao.js";
import * as attemptDao from "../Attempt/dao.js";
export default function QuizRoutes(app) {

    // Create a new quiz within a course (Faculty only)
    app.post('/api/courses/:cid/quizzes', async (req, res) => {
        const { cid } = req.params;
        const quizData = req.body;
        const quiz = await quizzesDao.createQuiz(cid, quizData);
        res.json(quiz);
    });

    // Retrieve a list of quizzes for a course
    app.get('/api/courses/:cid/quizzes', async (req, res) => {
        const { cid } = req.params;
        const quizzes = await quizzesDao.getQuizzesByCourse(cid);
        res.json(quizzes);
    });

    // Retrieve details of a specific quiz
    //这个你想加course route也可以但是这样其实就能得到了,就是你点进去可以预览
    app.get('/api/quizzes/:qid', async (req, res) => {
        const { qid } = req.params;
        const quiz = await quizzesDao.getQuizById(qid);
        res.json(quiz);
    });

    // Update quiz details (Faculty only)
    app.put('/api/quizzes/:qid', async (req, res) => {
        const { qid } = req.params;
        const quizData = req.body;
        const updatedQuiz = await quizzesDao.updateQuiz(qid, quizData);
        res.json(updatedQuiz);
    });

    // Delete a quiz (Faculty only)
    app.delete('/api/quizzes/:qid', async (req, res) => {
        const { qid } = req.params;
        await quizzesDao.deleteQuiz(qid);
        res.sendStatus(204);
    });

    // Publish or unpublish a quiz (Faculty only)
    app.put('/api/quizzes/:qid/publishStatus', async (req, res) => {
        try {
            const {qid} = req.params;
            const quiz = await quizzesDao.togglePublishQuiz(qid);
            res.json({ published: quiz.published });
        }catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}