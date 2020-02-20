const express=require('express');
const router=express.Router();
//var data=require('./data');
var data;
var keys=[];
var https=require('https');

function get(tagname){
    var request=https.get("https://hatchways.io/api/assessment/blog/posts?tag="+tagname, function(response){
        var body="";
        response.on("data",function(chunk){
            body+=chunk;
        });

        response.on("end",function(){
            if(response.statusCode===200){
                   // data=JSON.parse(body);
                    if(!JSON.parse(body)){
                        return response.status(400).json({error:"Error in tag parameter"});
                    }
                    else{
                        data=JSON.parse(body);
                    }
                 }
            else{
                response.status(400).json({error:"There was error getting profile"});
            }
        })
    })
}

router.get('/ping',(req,res)=>{
    res.json({"success":true});
})

router.get('/posts',async(req,res)=>{
    try{
        var tags=req.query.tags;
        var tagarr=[];
        var tagarr=tags.split(",");
        var arr=[];
        for(var c=0;c<tagarr.length;c++){
            get(tagarr[c]);
            console.log(tagarr[c]);
            for(var k in data.posts[0]) keys.push(k);
            //console.log(data.posts);
            for(var i=0;i<data.posts.length;i++){
                var obj=data.posts[i];
                if(!obj){
                    return res.status(400).json("Invalid tag parameter");
                }else{
                    if(!arr.includes(obj))
                        arr.push(obj);
                
                }
            }
            console.log(arr);
        }
        var sortBy = req.query.sortBy || 'id';
        var direction = (req.query.direction || 'asc').toLowerCase();
        
                if(!keys.includes(sortBy)){
                    return res.status(400).json({error:"SortBy parameter is invalid"});
                }
                
        if(!tags){
            return res.status(400).json({error:"Tags parameter is required"});
        }
            
    arr.sort(function(a,b){
            if(direction==='asc')
                return a[sortBy] - b[sortBy];
            else if(direction==='desc')
                return b[sortBy]-a[sortBy];
            else
                return res.status(400).json({error:"Direction parameter is invalid"});
        }
    )
    res.json(arr);

    }catch(err){
        res.status(500).send("Server Error");
    }
});

module.exports=router;