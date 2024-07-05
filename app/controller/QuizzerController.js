const Joi = require("joi");
const Quizzer = require("../model/Quizzer");

const QuizzerController = {
  createQuizzer: async (req, res, next) => {
    const { _id, name, email } = req.body;

    // Validation schema
    const quizzerSchema = Joi.object({
      _id: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    // Validate incoming data
    const { error } = quizzerSchema.validate({ _id, name, email });
    if (error) return res.status(400).send("[validation error] Invalid data given.");

    try {
      const quizzer = new Quizzer({ _id, name, email });
      const savedQuizzer = await quizzer.save();
      return res.status(200).send(savedQuizzer);
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while creating the quizzer.");
    }
  },

  get: async (req, res, next) => {
    try {
      const quizzer = await Quizzer.findOne({ _id: req.params.id });
      if (quizzer) {
        const { _id, name, email, quizCurated, quizAttended, quizFlawless } = quizzer;
        return res.status(200).send({ _id, name, email, quizCurated, quizAttended, quizFlawless });
      }
      return res.status(404).send("Quizzer not found.");
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while retrieving the quizzer.");
    }
  },

  findAll: async (req, res, next) => {
    try {
      const quizzers = await Quizzer.find();
      return res.status(200).send(quizzers);
    } catch (err) {
      console.error("Error", err);
      return res.status(500).send("An error occurred while retrieving quizzers.");
    }
  },

  incrementCuratedCount: async (user_id) => {
    try {
      const quizzer = await Quizzer.findByIdAndUpdate(user_id, { $inc: { quizCurated: 1 } }, { new: true });
      return quizzer;
    } catch (err) {
      console.error("Error", err);
      return false;
    }
  },

  incrementParticipationCount: async (user_id, flawless) => {
    try {
      const quizzer = await Quizzer.findById(user_id);

      if (!quizzer) {
        throw new Error("Quizzer not found");
      }

      quizzer.quizAttended++;
      quizzer.quizFlawless += flawless; // + 0 or 1

      const updatedQuizzer = await quizzer.save();
      return updatedQuizzer;
    } catch (err) {
      console.error("Error", err);
      return false;
    }
  },
};

module.exports = QuizzerController;
