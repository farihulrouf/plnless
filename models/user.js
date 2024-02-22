const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const validator = require('validator')

const dataSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique : true,
        validate : validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength : [6, "Password Must Be Atleast 6 characters"],
    },
    typeuser: {
        type: String,
        enum: ["Admin", "Moderator", "User"]
    },

    created_at:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('User', dataSchema)