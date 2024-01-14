const express = require('express');
const Model = require('../models/price');
const router = express.Router();
const auth = require('../middlewares/authJwt')
router.post('/post', async (req, res) => {
    const data = new Model({
        harga: req.body.harga,
        satuan: req.body.satuan,
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;