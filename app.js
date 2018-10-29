const express = require('express');
const mongoose = require('mongoose');
const scheduler = require('./core/scheduler');
const errorhandler = require('errorhandler');
const cors = require('cors');
let isProduction = process.env.NODE_ENV === 'production';




const app = express();
app.use(cors());
app.use(require('./routes'));
if(!isProduction) {
    app.use(errorhandler());
}

if(isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect('mongodb://localhost:27017/scrapper',{ useNewUrlParser: true });
    mongoose.set('debug', true);
}


/* catch 404 and forward to error handllers */

 /// catch 404 and forward to error handler
 app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
 
/* development error handllers */
if(!isProduction) {
    app.use(function(req, res, next) {
        console.log(err.stack);
        res.status(err.status || 500);
        res.json({
            'errors':{
                message:err.message,
                error:{}
            }
        });
    });
}

/* production error handllers */

app.use(function(req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors':{
            message:err.message,
            error:{}
        }
    });
});

//Initializing cron job.
scheduler.crawlerCronJob.start();

/* Finally we start our server */
let server = app.listen(process.env.PORT || 8000, function(){
    console.log('Listening on port '+ server.address().port);
});






