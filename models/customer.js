const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },

    no_id: {
        required: true,
        type: Number,
        unique: true,
    },
    
    no_tel: {
        required: true,
        type: Number
    },
    
    addres: {
        required: false,
        type: String
    },
    gender: {
        type: String,
        enum: ["L", "P"]
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

//module.exports = mongoose.model('Customer', dataSchema)

dataSchema.plugin(mongoosePaginate);
const Customermodel = mongoose.model('Customer', dataSchema);
Customermodel.paginate().then({}); // Usage

//partSchema.plugin(mongoosePaginate);

//const part = mongoose.model("part", partSchema);

module.exports = Customermodel;