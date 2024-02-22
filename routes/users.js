const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("bcrypt/promises");
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, typeuser, no_id } = req.body;

    // console.log(userusername, email, password);
    //console.log(req.body)
    if (!username || !email || !password || !typeuser || !no_id) {
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
      typeuser,
      no_id,
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
        typeuser: user.typeuser,
        no_id: user.no_id
      },

      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    delete user.password;

    return res.status(200).json({
      success: true,
      message: `Welcome back`,
      user: {
        username: user.username,
        email: user.email,
        typeuser: user.typeuser,
        token: jwtToken,
      },
      // res.json({ token: jwt.sign({ username: user.username, email: user.email }, 'RESTFULAPIs') })
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    //  const { id } = req.params;
    const id = req.params.id;

    const { username, email, password, typeuser } = req.body;
    console.log("data params", id);

    if (!username || !email || !password || !typeuser) {
      return res.status(400).json({
        success: false,
        message: "Please enter All Fields",
      });
    }

    {
      /*
    const data = await User.findById(req.params.id);
    if(data) {
      res.status(200).send({msg: "user Not found!"})
    }
    */
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const updateData = {
      username,
      email,
      password: hashedPassword,
      typeuser,
    };
    //console.log(req.body);
    //password = hashedPassword

    const user = await User.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    });
    res.status(200).json({
      msg: "Successful updated",
      user: user,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.get("/all", async (req, res) => {
  let { page, limit, s } = req.query;

  try {
    var condition = s ? { name: { $regex: new RegExp(s), $options: "i" } } : {};
    const result = await User.aggregate([
      {
        $match: condition,
      },
      { $sort: { created_at: -1 } },
      {
        $facet: {
          metaData: [
            {
              $count: "totalDocuments",
            },
            {
              $addFields: {
                pageNumber: page,
                totalPages: {
                  $ceil: { $divide: ["$totalDocuments", parseInt(limit)] },
                },
              },
            },
          ],
          data: [
            {
              $skip: (page - 1) * parseInt(limit),
            },
            {
              $limit: parseInt(limit),
            },
          ],
        },
      },
    ]);
    return res.status(200).send({ success: true, msg: "Sucess", user: result });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

module.exports = router;
