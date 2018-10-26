const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let SiteSchema = new Schema({
    root_url:{
        type:String,
        required:[true,"Url is required"],
        unique:true,
    }
},{timestamps:true});

module.exports = mongoose.model('Site',SiteSchema);