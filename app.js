import express from "express";
import path from "path";
import mongoose from 'mongoose';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const app = express();
var Schema = mongoose.Schema; 

app.use(express.static(path.join(__dirname, '/public')));

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://0.0.0.0:27017/test?directConnection=true').then(function(){
    console.log("Connected to DB");
}).catch(function(err){  
    console.log("Error connecting to DB", err);
});
var TextDataSchema = new Schema({
   content:String, 
   view:Number,  
   createAt:{type:Date, default:Date.now}
  },{collection:'textdata'});
var TextData =  mongoose.model('TextData',TextDataSchema);


app.get("/", async (req, res) => {
    const data = await TextData.find();
    res.render("home", { texts:data });
    
});
//insert text
app.post("/insert", async (req, res) => {
    const content = {content: req.body.txtContent};
    const data = new TextData(content);
    await data.save();
    res.redirect("/");
});
//delete text
app.get("/deleteText/:id", async (req, res) => {
    const id = req.params.id;
    await TextData.findByIdAndDelete(id);
    res.redirect("/");
});
//edit text
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    const data = await TextData.findById(id);
    res.render("editText", { text:data });
});
//update text
app.post("/update", async (req, res) => {
    const id = req.body.txtId;
    const content = {content: req.body.txtContent};
    await TextData.findByIdAndUpdate(id, content);
    res.redirect("/");
});
  
//SHOW_TEXT
app.get("/viewText/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const data = await TextData.findById(id);
    res.render("showText", { text:data });
   
});

const PORT = process.env.PORT || 8000;
app.listen(PORT);
console.log("server running :", PORT);
