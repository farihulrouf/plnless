const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({


    harga: {
        required: true,
        type: Number
    },
    minimum: {
        required: true,
        type: Number
    },
    maximum: {
        required: true,
        type: Number
    },
    satuan: {
        required: true,
        type: String,
        default: 'kubik'
    },
    created_at:{
        type:Date,
        default:Date.now
    },

    updated_at:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Price', dataSchema)