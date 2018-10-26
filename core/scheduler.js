const CronJob = require('cron').CronJob;
const request = require('request');
const Site = require('../models/Site');
const crawler = require('./crawler');

module.exports.crawlerCronJob =  new CronJob({
        cronTime:'0 8 * * * *',
        onTick:function(){
            console.log("-------------------------Crawling Started--------------------");
    
            Site.find({},{root_url:1,_id:0})
            .then(function(sites) {
                if(sites){
                    crawler(sites.map((site)=>{
                        return site.root_url;
                    }))
                }
                
            });
        },
        timeZone:'Asia/Kolkata',
    });