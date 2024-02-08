const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, typeuser} = req.body;

    // console.log(userusername, email, password);

    if (!username || !email || !password || !typeuser) {
      return res.status(400).json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already Exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // console.log(hashedPassword);

    let newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      typeuser
    });

    return res.status(200).json({
      success: true,
      message: "User Created Successfully",
      user: newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email or Password",
      });
    }

    let jwtToken = jwt.sign(
        {
            user_id: user._id,
            email: user.email,
            username: user.username,
            typeuser: user.typeuser      
        },
        
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    )

    delete user.password;

    
    return res.status(200).json({
      success: true,
      message: `Welcome back`,
      user: {
        username: user.username,
        email: user.email,
        typeuser: user.typeuser,
        token: jwtToken
      }
      // res.json({ token: jwt.sign({ username: user.username, email: user.email }, 'RESTFULAPIs') })
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
*/



module.exports = router;
