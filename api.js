const express=require('express');
const router=express.Router();
var data=require('./data');
router.get('/',(req,res)=>{
    res.json(data)
});

router.get('/ping',(req,res)=>{
    res.json({"success":true});
})

router.get('/posts',async(req,res)=>{
    try{
        var tags=req.query.tags;
        var tagarr=[];
        var tagarr=tags.split(",")
        var sortBy = req.query.sortBy || 'id';
        var direction = (req.query.direction || 'asc').toLowerCase();
        var arr=[];
        var keys=Object.keys(data.posts[0]);
        if(!keys.includes(sortBy)){
            return res.status(400).json({error:"SortBy parameter is invalid"});
        }
        if(!tags){
            return res.status(400).json({error:"Tags parameter is required"});
        }
        for(var i=0;i<data.posts.length;i++){
            var found=false;
            var obj=data.posts[i];
                found=tagarr.some(r=>obj.tags.includes(r));
                if(found){
                    arr.push(obj);
                    continue;
                }
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