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
        const { sort } = req.query;
        try {
            const quizzes = await quizzesDao.getQuizzesByCourse(cid, sort);
            res.json(quizzes);
        } catch (error) {
            console.error("Error fetching sorted quizzes:", error);
            res.status(500).send({ error: 'Failed to fetch quizzes' });
        }
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
        const result = await quizzesDao.deleteQuiz(qid);
        if (result) {
            res.sendStatus(204); // 204: No Content
        } else {
            res.status(404).json({ error: "Quiz not found" }); // 404: Not Found
        };
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


    //copy quiz function
    app.post('/api/quizzes/:qid/copy', async (req, res) => {
        const { qid } = req.params;
        const { targetCourseId } = req.body;
    
        if (!targetCourseId) {
            return res.status(400).json({ error: "Target course ID is required" });
        }
    
        try {
            const copiedQuiz = await quizzesDao.copyQuiz(qid, targetCourseId);
            res.status(200).json({
                message: "Quiz copied successfully",
                quiz: copiedQuiz,
            });
        } catch (error) {
            console.error("Error copying quiz:", error);
            res.status(500).json({ error: error.message });
        }
    });
}