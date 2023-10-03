const mongoose = require('mongoose')

const prodcutSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Enter Product Name'],
        trim:true,
        maxLength:[100,'Product name cannot exceed 100 characters']
    },
    price:{
        type:Number,
        required:[true,'Please Enter Product price'],
        maxLength:[5,'Product price cannot exceed 5 characters'],
        default:0.0
    },
    description:{
        type:String,
        required:[true,'Please Enter Product Description'],
        
    },

    ratings:{
        type:Number,
        default:0
     
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        }
    ],
    volume:{
        type:[String],
        required:[true,'Please enter volumes for this product'],
       },

    stock:{
        type:Number,
        required:[true,'Please Enter Product stock'],
        maxLength:[5,'Product name cannot exceed 5 characters'],
        default:0
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true

            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Seller',
        required: true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('Product',prodcutSchema);