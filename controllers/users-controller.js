const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const User = require("../models/user");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Andres",
    email: "test@test.com",
    password: "test",
  },
];

const getUsers = (req, res, next) => {
  const users = DUMMY_USERS;

  if (!users || users.length === 0) {
    return next(new HttpError("There's not users.", 404));
  }

  res.json({ users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please your data", 422));
  }

  const { name, email, password, places } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image:
      "https://imgs.search.brave.com/e7tcMRl2HAyP1hs-0tEryj3dSiy1cqc0-KrLX8HCX58/rs:fit:800:533:1/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi95b3Vu/Zy1idXNpbmVzc21l/bi1oYWlsaW5nLXRh/eGktYnVzaW5lc3Nt/YW4td2VhcmluZy1z/dWl0LWNhdGNoaW5n/LTkyNTA4MzQzLmpw/Zw",
    password,
    places,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up a new user failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong.",
      401
    );
  }
  res.json({ message: "Logged In" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
