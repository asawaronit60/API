const mongoose  = require('mongoose')
const express = require('express');
const bodyParser = require('body-parser')
const ejs = require('ejs');
const app = express();

app.set('view-engine',ejs);
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const wikiSchema = new mongoose.Schema({
    title:String,
    content:String
})

const Article = new mongoose.model("Article",wikiSchema);

app.route("/article").get((req,res)=>{
    Article.find({},(err,foundArticles)=>{
        res.send(foundArticles)
    })
  })
  .post((req,res)=>{

    let article  =new Article();

    article.title =req.body.title;
    article.content = req.body.content;

    article.save((err)=>{
    if(!err) res.send("Successfully added to the database")
    else   
        res.send(err);
    
   }); 
 }).delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(!err) 
        res.send("Deleted Successfully")
        else res.send(err);
    })
});
//////////////////////////////////////////specific routing/////////////////////

app.route("/article/:articleTitle")
.get(function(req,res){
    title = req.params.articleTitle
    Article.findOne({title:title},(err,foundArticle)=>{
        if(!err)
        res.send(foundArticle)
    else res.send(err)
    })
})
.put(function(req,res){
    Article.update(
     {title:req.params.articleTitle},
     {title:req.body.title , content: req.body.content},
     {overwrite: true},
     function(err,result){
         if(!err) res.send(result)
         else res.send(res)
     }
    )//update
})

.patch(function(req,res){
    Article.update(
        {title:req.params.articleTitle},
        {$set :req.body},
        function(err,result){
            if(!err) res.send(result)
            else console.log(err);
        }
    )
})

.delete(function(req,res){
   Article.deleteOne({title:req.params.articleTitle},(err,result)=>{
       if(!err) res.send(result)
        else res.send(err)
   })
})



app.listen(3000,function(){
    console.log("server started on port 3000");
})
