
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: "department"
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  qualifications: [
    {
      year: String,
      title: String,
      description: String
    }
  ],
  skills: {
    description: String,
    expertise: [String]
  },
  appointment: {
    mondayToFriday: String,
    saturday: String,
    sunday: String,
    contactNumber: String
  }
});

module.exports = mongoose.model('doctor', DoctorSchema);
