const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        
    },
    noinv: {
        type: Number,
        required: [true, "Amount is required"],
        default: 0,
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        default: 0,
    },

    meteran: {
        type: Number,
        required: [true, "Amount is required"],
        default: 0,
    },

    no_id: {
        required: true,
        type: Number,
    },

    status: {
        type: Boolean,
        default: false
    },

    transactionType: {
        type: String,
        required: [true, "Transaction Type is required"],
        
    },

    date: {
        type: Date,
        default:Date.now
    },

    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },

    created_at: {
        type:Date,
        default:Date.now
    },

    updated_at:{
        type:Date,
        default:Date.now
    }

});
module.exports = mongoose.model('Transaction', transactionSchema)
