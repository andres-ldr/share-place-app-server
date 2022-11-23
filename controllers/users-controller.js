const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

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

const signup = (req, res, next) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please your data", 422);
  }

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser)
    throw new HttpError("Could not create user, email already exists.", 401);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);
  res.status(201).json({ user: newUser });
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
