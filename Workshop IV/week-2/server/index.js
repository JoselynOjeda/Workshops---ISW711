const express = require('express'); //framework
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController'); // Asegúrate que la ruta es correcta
const app = express();
// database connection
const mongoose = require("mongoose"); //npm install mongoose
const db = mongoose.connect("mongodb+srv://Joselyn:Admin12345@cluster0.nlq3u.mongodb.net/teachers"); //conectar a la conexion, es diferente

const path = require('path');

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  origin: 'http://localhost:8080'
}));

const { teacherGet, teacherPost, teacherPatch, teacherDelete } = require('./controllers/teacherController');

const { courseGet, coursePost, courseUpdate, courseGetById, deleteCourse} = require('./controllers/courseController');

app.post('/api/register', authController.register);
app.post('/api/authenticate', authController.login);
// listen to the task request
app.post("/api/teachers", teacherPost);
app.get("/api/teachers/",teacherGet);
app.patch("/api/teachers", teacherPatch);
app.put("/api/teachers", teacherPatch);
app.delete("/api/teachers", teacherDelete);

app.get("/api/courses/", courseGet);
app.post("/api/courses/", coursePost);
app.put("/api/courses/:id", courseUpdate);
app.get("/api/courses/:id", courseGetById);
app.delete('/api/courses/:id', deleteCourse);


app.listen(3001, () => console.log(`Example app listening on port 3001!`))
