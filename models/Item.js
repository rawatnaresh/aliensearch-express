const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ItemSchema = new Schema({
    url:{
        type:String,
        required:[true,"Url is required"],
        unique:true,
    },
    name:{
        type:String,
        required:[true,'Item name is required']
    },
    tags:{type:String}
},{timestamps:true});

//Defining index for searching
ItemSchema.index(
    {'name':'text','tags':'text'}
);


module.exports = mongoose.model('Item',ItemSchema);