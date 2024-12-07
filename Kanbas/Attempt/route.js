import * as attemptDao from "./dao.js";
export default function AttemptRoutes(app){
    app.post('/api/quizzes/:quizId/attempts', async (req, res) => {
        const { quizId } = req.params;
        const { studentId } = req.body; // 从请求体中获取 studentId
        try {
            const attempt = await attemptDao.startAttempt(quizId, studentId);
            res.status(201).json(attempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

// Submits answers for a quiz attempt (Students)
    app.post('/api/attempts/:attemptId/submit', async (req, res) => {
        const { attemptId } = req.params;
        const answers = req.body.answers;
        try {
            const attempt = await attemptDao.submitAttempt(attemptId, answers);
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

// Retrieves attempts for a quiz (Students)
    app.get('/api/quizzes/:quizId/attempts', async (req, res) => {
        const { quizId } = req.params;
        const { studentId } = req.query; // 从查询参数中获取 studentId
        try {
            const attempts = await attemptDao.getAttemptsByQuizAndStudent(quizId, studentId);
            res.json(attempts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

// Retrieves details of a specific attempt (Students)
    app.get('/api/quizzes/:quizId/attempts/:attemptId', async (req, res) => {
        const { attemptId } = req.params;
        try {
            const attempt = await attemptDao.getPopulatedAttempt(attemptId);
            res.json(attempt);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}