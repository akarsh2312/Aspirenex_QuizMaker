const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// database schema
const User = require("../model/User");

const AuthController = {
  // validation schema
  registerUser: async (req, res, next) => {
    const registrationSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    try {
      // validating given data
      const { error } = registrationSchema.validate(req.body);
      if (error)
        return res.status(400).send("[validation error] Invalid data given.");

      // checking if already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) return res.status(400).send("User already exists");

      // create user
      const { name, email, password } = req.body;

      // hasing password
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(password, salt);

      const user = new User({
        name: name,
        email: email,
        password: hashedPass,
      });
      const savedUser = await user.save();
      return res.status(200).json(savedUser);
    } catch (err) {
      console.error(err);
      return res.status(500).send("An error occurred while registering the user.");
    }
  },
  loginUser: async (req, res, next) => {
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    try {
      // validating given data
      const { error } = loginSchema.validate(req.body);
      if (error)
        return res.status(400).send("[validation error] Invalid Credentials.");

      // checking if does not exist
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(400).send("User does not exist!");

      // checking if password is valid
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) return res.status(400).send("Invalid Credentials!");

      // create and assign a jwt token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      const { _id, name, email } = user;
      return res
        .header("auth-token", token)
        .status(200)
        .send({ _id, name, email });
    } catch (err) {
      console.error(err);
      return res.status(500).send("An error occurred while logging in.");
    }
  },

  verifyToken: (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access Denied");
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      console.error(err);
      return res.status(400).send("Invalid Token");
    }
  },
};

module.exports = AuthController;
