const express = require('express'); //framework
const app = express();
// database connection
const mongoose = require("mongoose"); //npm install mongoose
const db = mongoose.connect("mongodb+srv://Joselyn:Admin12345@cluster0.nlq3u.mongodb.net/teachers"); //conectar a la conexion, es diferente

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:8080'
}));

const { teacherGet, teacherPost, teacherPatch, teacherDelete } = require('./controllers/teacherController');


// listen to the task request
app.post("/api/teachers", teacherPost);
app.get("/api/teachers/",teacherGet);
app.patch("/api/teachers", teacherPatch);
app.put("/api/teachers", teacherPatch);
app.delete("/api/teachers", teacherDelete);


app.listen(3001, () => console.log(`Example app listening on port 3001!`))
