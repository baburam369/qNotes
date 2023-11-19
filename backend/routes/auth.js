const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchUser');
const router = express.Router();

//jwt token
const JWT_SECRET = "thi$issecure";
//ROUTE 1: create user using : POST "/api/auth/"
router.post(
  "/createuser",
  [
    //validation
    body("name", "Enter Valid Name").isLength({ min: 3 }),
    body("email", "Enter Valid email").isEmail(),
    body("password", "Enter Valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false
    //errors? return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    //check if same email user exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "User with the email exists already" });
      }
      //use bcrypt to encrypt password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(authToken);
      success=true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 2: Authenticate a user
router.post(
  "/login",
  [
    body("email", "Enter Valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    //errors ? return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please enter valid credentials" });
      }
      //compare password with bcrypt
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword) {
        success = false;
        return res
          .status(400)
          .json({ success, error: "Please enter valid credentials" });
      }
      //if everything is okay
      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3 : Get user details using: POST "/api/auth/getuser". Login required
router.post(
    '/getuser', fetchuser, async (req, res) => {
      try {
        if (!req.user) {
          console.error('User data not found in request');
          return res.status(401).json({ error: 'Authentication failed' });
        }
       
        const userId = req.user;
        console.log('User ID from token:', userId);
    
        // Ensure that the User.findById query is structured properly
        const user = await User.findById(userId).select('-password');
        res.send(user);
      
      
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
      }
    }
  );

module.exports = router;
