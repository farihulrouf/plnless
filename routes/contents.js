const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authJwt')

router.get('/all', async (req, res) => {
    res.send('Hey this is my API public 🥳')
})

router.get('/admin',auth.protect, auth.checkAdmin, async (req, res) => {
    res.send('This role admin')
})

module.exports = router;