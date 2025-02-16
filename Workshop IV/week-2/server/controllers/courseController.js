const Course = require("../models/courseModel");

/**
 * Creates a course
 *
 * @param {*} req
 * @param {*} res
 */
const coursePost = async (req, res) => {
  let course = new Course(req.body);
  await course.save()
    .then(course => {
      res.status(201); // CREATED
      res.header({
        'location': `/api/courses/?id=${course.id}`
      });
      res.json(course);
    })
    .catch( err => {
      res.status(422);
      console.log('error while saving the course', err);
      res.json({
        error: 'There was an error saving the course'
      });
    });
};

/**
 * Get all courses or one
 *
 * @param {*} req
 * @param {*} res
 */
const courseGet = (req, res) => {
  Course.find().populate('teacher') 
      .then(courses => {
          res.status(200).json(courses);  
      })
      .catch(err => {
          console.error("Error retrieving courses:", err);
          res.status(500).json({ error: "Error retrieving courses", details: err.message });
      });
};

/**
 * Updates a course
 *
 * @param {*} req
 * @param {*} res
 */
const courseUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(updatedCourse);
  } catch (err) {
    res.status(422).json({ error: "There was an error updating the course", details: err.message });
  }
};

const courseGetById = async (req, res) => {
  try {
      const course = await Course.findById(req.params.id).populate('teacher');
      if (!course) {
          return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
      const course = await Course.findByIdAndDelete(req.params.id);
      if (!course) {
          return res.status(404).json({ message: "No se encontró el curso con el ID proporcionado" });
      }
      res.status(204).send(); 
  } catch (error) {
      res.status(500).json({ error: "Error al eliminar el curso", details: error.message });
  }
};

module.exports = {
  coursePost,
  courseGet,
  courseUpdate,
  courseGetById,
  deleteCourse
}