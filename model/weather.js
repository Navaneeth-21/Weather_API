const mongoose = require('mongoose');

const createSchema = new mongoose.Schema({
    cityName:{
        type : String,
        required : true
    },
    temperature:{
        type : String,
        required : true
    },
    condition:{
        type : String,
        required : true
    },
    createdAt:{
        type : Date,
        default :  Date.now()
    }

});


module.exports = mongoose.model('weather',createSchema);