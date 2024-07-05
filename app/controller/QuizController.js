const Joi = require("joi");
const Quiz = require("../model/Quiz");
const QuizzerController = require("./QuizzerController");

const QuizController = {
  createQuiz: async (req, res, next) => {
    const { title, description, type, questions } = req.body;
    const user_id = req.params.user_id;

    // Validation schema
    const quizSchema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      type: Joi.string().required(),
      questions: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          options: Joi.array().items(Joi.string().required()).required(),
          answer: Joi.string().required(),
        })
      ).required(),
    });

    // Validate incoming data
    const { error } = quizSchema.validate({ title, description, type, questions });
    if (error) return res.status(400).send("[validation error] Invalid data given.");

    try {
      // Create Quiz
      const quiz = new Quiz({ user_id, title, description, type, questions });
      const savedQuiz = await quiz.save();

      const quizzer = await QuizzerController.incrementCuratedCount(user_id);
      if (quizzer) {
        return res.status(200).send(savedQuiz);
      }
      return res.status(400).send("Quizzer Does not exist.");
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while creating the quiz.");
    }
  },

  findById: async (req, res, next) => {
    try {
      const quiz = await Quiz.findById(req.params.quiz_id);
      if (quiz) {
        // Remove answers and send
        const { questions } = quiz;
        const sanitizedQuestions = questions.map(({ _id, options, id, title }) => ({
          _id,
          options,
          id,
          title,
        }));
        quiz.questions = sanitizedQuestions;
        return res.status(200).send(quiz);
      }
      return res.status(404).send("Quiz not found.");
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while retrieving the quiz.");
    }
  },

  findAll: async (req, res, next) => {
    try {
      const quizzes = await Quiz.find();
      if (quizzes) {
        return res.status(200).send(quizzes);
      }
      return res.status(404).send("No quizzes found.");
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while retrieving quizzes.");
    }
  },

  findByUser: async (req, res, next) => {
    try {
      const quizzes = await Quiz.find({ user_id: req.params.user_id });
      if (quizzes) {
        return res.status(200).send(quizzes);
      }
      return res.status(404).send("No quizzes found for this user.");
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while retrieving quizzes.");
    }
  },

  submitQuizAnswer: async (req, res, next) => {
    try {
      const user_id = req.params.user_id;
      const { quiz_id, answers } = req.body;

      const quiz = await Quiz.findById(quiz_id);
      if (quiz) {
        let solved = 0;
        const { questions } = quiz;
        questions.forEach((question, i) => {
          if (question.answer === answers[i].answer) {
            solved++;
          }
        });

        // Update quiz stats
        quiz.participated++;
        quiz.flawless += Number(solved === questions.length); // + 0 or 1
        const updatedQuiz = await Quiz.findByIdAndUpdate(quiz_id, quiz, { new: true });

        // Update quizzer stats
        const updatedQuizzer = await QuizzerController.incrementParticipationCount(
          user_id,
          solved === questions.length
        );

        const response = {
          user_id,
          quiz_id,
          total_questions: questions.length,
          solved,
        };
        return res.status(200).send(response);
      } else {
        return res.status(404).send("Quiz not found!");
      }
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while submitting quiz answers.");
    }
  },
};

module.exports = QuizController;
