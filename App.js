import express from 'express';
import mongoose from "mongoose";
import Hello from "./hello.js";
import cors from "cors";
import CourseRoutes from "./Kanbas/Courses/routes.js";
import ModuleRoutes from "./Kanbas/Modules/routes.js";
import AssignmentRoutes from "./Kanbas/Assignments/routes.js";
import UserRoutes from "./Kanbas/users/routes.js";
import "dotenv/config";
import session from "express-session";
import EnrollRoutes from "./Kanbas/Enrollments/router.js";
import QuizRoutes from "./Kanbas/Quizzes/route.js";
import QuestionRoutes from "./Kanbas/Questions/route.js";
import AttemptRoutes from "./Kanbas/Attempt/route.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kanbas"
mongoose.connect(CONNECTION_STRING);

const app = express();
app.use(
    cors({
        credentials: true,
        origin: [process.env.NETLIFY_URL, "http://localhost:3000"],
    })
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kanbas",
    resave: false,
    saveUninitialized: false,
    };
if (process.env.NODE_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        domain: process.env.NODE_SERVER_DOMAIN,
    };
}
app.use(session(sessionOptions));

app.use(express.json());
AttemptRoutes(app);
QuestionRoutes(app);
QuizRoutes(app);
UserRoutes(app);
CourseRoutes(app);
EnrollRoutes(app)
ModuleRoutes(app);
AssignmentRoutes(app)
Hello(app)
app.listen(process.env.PORT || 4000)
