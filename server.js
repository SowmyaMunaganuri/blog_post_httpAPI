const express= require("express");
const app=express();
const https=require("https");

app.use(express.json({extended:false}));
app.use('/api',require('./api'));
app.get('/',(req,res)=>{
    res.send("API running");
});
const PORT= 5000|| process.env.PORT;
app.listen(PORT,()=>console.log(`Console started..`));
