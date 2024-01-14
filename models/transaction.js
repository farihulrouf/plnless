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

    transactionType: {
        type: String,
        required: [true, "Transaction Type is required"],
        
    },

    date: {
        type: Date,
        required: [true, "Date is required"],
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
