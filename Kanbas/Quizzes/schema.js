import mongoose from "mongoose";
const schema = new mongoose.Schema(
    {
            title: { type: String, required: true },
            description: String,
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseModel', required: true },
            createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true }, // Faculty user
            settings: {
                    quizType: { type: String,
                                enum: ['Graded Quiz', 'Practice Quiz', 'Graded Survey', 'Ungraded Survey'],
                                default: 'Graded Quiz' },
                    assignmentGroup: { type: String,
                                        enum: ['Quizzes', 'Exams', 'Assignments', 'Project'],
                                        default: 'Quizzes' },
                    shuffleAnswers: { type: Boolean, default: true },
                    timeLimit: { type: Number, default: 20 }, // In minutes
                    multipleAttempts: { type: Boolean, default: false },
                    attemptsAllowed: { type: Number, default: 1 },
                    showCorrectAnswers: { type: Boolean, default: true },
                    accessCode: { type: String, default: "" },
                    oneQuestionAtATime: { type: Boolean, default: true },
                    webcamRequired: { type: Boolean, default: false },
                    lockQuestionsAfterAnswering: { type: Boolean, default: false },
            },
            points: { type: Number, default: 0 },
            published: { type: Boolean, default: false }, //for published or not
            questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'QuestionModel' }],
            dueDate: { type: Date, default: Date.now },
            availableFrom: { type: Date, default: Date.now },
            availableUntil: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    },
    { collection: "quizzes" }
);
export default schema;