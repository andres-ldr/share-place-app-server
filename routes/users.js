const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controller");
const router = express.Router();

router.get("/", usersControllers.getUsers);
router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").notEmpty().isEmail(),
    check("password").notEmpty(),
  ],
  usersControllers.signup
);
router.post("/login", usersControllers.login);

module.exports = router;
