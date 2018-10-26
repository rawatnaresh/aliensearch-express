let Item = require('../../models/Item');
const router = require('express').Router();

router.get('/', function(req, res, next) {
    console.log(req.query);
    if(!req.query['q']) { return res.sendStatus(404);}
    let pageNumber = 1;
    let limit = 30;
    if(req.query['p'] && req.query['p'] > 0)
        pageNumber = req.query['p'];
    
    let offset = limit * (pageNumber-1);
    let searchQuery = req.query['q'];

    let seasonIndex = searchQuery.search(/season/gi);

    if( (seasonIndex != -1) && (searchQuery.charAt(Number(seasonIndex+6)) != " ") ){
        //user is looking for specific season
        searchQuery = searchQuery.slice(0, seasonIndex+6)+" "+searchQuery.slice(seasonIndex+6);   
    }

    let episodeIndex = searchQuery.search(/episode/gi);
    if( (episodeIndex != -1) && (searchQuery.charAt(Number(episodeIndex+7)) != " ")){
        //user is looking for specific episode
        console.log("No space after episode");
        searchQuery = searchQuery.slice(0, episodeIndex+7)+" "+searchQuery.slice(episodeIndex+7);
    }

    console.log("Formatted String",searchQuery);

    searchQuery += " ";

    if(seasonIndex != -1) {
        let seasonNum = searchQuery.slice(seasonIndex+7,seasonIndex+9).trim();
        if(seasonNum.length == 1)
            searchQuery += `s0${seasonNum}`;
        else
            searchQuery += `s${seasonNum}`;
    }

    if(episodeIndex !=-1) {
        let episodeNum = searchQuery.slice(episodeIndex+8,episodeIndex+10).trim();

        if(episodeNum.length == 1)
            searchQuery += `e0${episodeNum}`;
        else
            searchQuery += `e${episodeNum}`;
    }
    console.log(offset);

    Promise.all([
        Item.find({$text:{$search:searchQuery}},
            {score:{$meta:'textScore'},url:1,name:1,_id:0}).sort({
                score:{$meta:'textScore'}
            }).count(),
        Item.find({$text:{$search:searchQuery}},
            {score:{$meta:'textScore'},url:1,name:1,_id:0}).sort({
                score:{$meta:'textScore'}
            })
            .skip(offset)
            .limit(limit)
        
    ]).then(function(results){
        let count = results[0];
        let result = results[1];
        return res.status(200).json({'results':result,'count':count,'limit':limit});
    }).catch((err)=>{
        return res.sendStatus(500);
    })

}); 

module.exports = router;