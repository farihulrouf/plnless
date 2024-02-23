const express = require("express");
const Model = require("../models/price");
const router = express.Router();
const auth = require("../middlewares/authJwt");
router.post("/post", async (req, res) => {
  const data = new Model({
    harga: req.body.harga,
    satuan: req.body.satuan,
    minimum: req.body.minimum,
    maximum: req.body.maximum,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

{/*
router.put("/:id", async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  ///:id
  //console.log('cek id', id)
  Model.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Price with id=${id}. Maybe price  was not found!`,
        });
      } else res.send({ message: "Price was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Price with id=" + id,
      });
    });
});
*/}


router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    updatedData.updated_at = new Date();
    const result = await Model.findByIdAndUpdate(id, updatedData, options);
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get("/getall", async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  let { id } = req.query;
  try {
    const data = await Model.findOne({ _id: id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
