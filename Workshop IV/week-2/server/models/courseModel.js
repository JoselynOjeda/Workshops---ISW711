const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
    trim: true      
  },
  code: {
    type: String,
    required: true,  
    unique: true,    
    trim: true      
  },
  description: {
    type: String,
    required: true,  
    trim: true       
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'teachers',
    required: true  
  }
});

module.exports = mongoose.model('Course', courseSchema);
