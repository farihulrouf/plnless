require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const con = require('./config/condb');
const app = express();
app.use(cors())
app.use(express.json());

const customers = require('./routes/customers')
const transactions = require('./routes/transactions')
const users = require('./routes/users')

app.get('/', (req, res) => {
    res.send('Hey this is my API running 🥳')
})
  

app.use('/customers', customers)
app.use('/transactions', transactions)
app.use('/users', users)


//app.use('/users', users)
app.listen(3000, () => {
    //console.log(`Server Started at ${3000}`)
})

module.exports = app