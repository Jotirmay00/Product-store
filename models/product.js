const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        maxlength : 20,
        trim : true,
    },

    price : {
        type : Number,
        required : true,
        
    },

    featured : {
        type : Boolean,
        default : true,
    },

    rating : {
        type : Number,
        min : 1,
        max :  5,
        default : 4.5
    },

    createdDate : {
        type : Date,
        default : Date.now(),
    },

    company : {
        type : String,
        enum : ['ikea' , 'sony' , 'apple', 'dell']
    }
})

module.exports = mongoose.model('Products',productSchema)