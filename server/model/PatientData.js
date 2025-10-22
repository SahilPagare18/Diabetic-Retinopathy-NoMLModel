// import mongoose from "mongoose";

// const PatientSchema = new mongoose.Schema({
//   patientId: {
//     type: String,
//     required: [true, 'Patient ID is required.'],
//     unique: true,
//     trim: true
//   },
//   patientName: {
//     type: String,
//     required: [true, 'Patient name is required.'],
//     trim: true
//   },
//   // --- NEW FIELD ---
//   contact: {
//     type: String,
//     required: [true, 'Contact number is required.'],
//     trim: true
//   },
//   dob: {
//     type: Date,
//     required: [true, 'Date of birth is required.']
//   },
//   age: {
//     type: Number,
//     required: [true, 'Age is required.']
//   },
//   gender: {
//     type: String,
//     required: [true, 'Gender is required.'],
//     enum: ['Male', 'Female', 'Other']
//   },
//   appointmentDate: {
//     type: Date,
//     required: [true, 'Appointment date is required.']
//   },
//   sugarLevel: {
//     type: String,
//     required: [true, 'Sugar level is required.']
//   },
//   bp: { // Blood Pressure
//     type: String,
//     required: [true, 'Blood pressure is required.']
//   },
//   diseaseStage: {
//     type: String,
//     trim: true
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: ['Remain', 'Complete'],
//     default: 'Remain'
//   },
//   reason: {
//     type: String,
//     required: true,
//     enum: ['New Patient', 'Follow-up']
//   }
// }, {
//   timestamps: true // Automatically adds createdAt and updatedAt fields
// });

// const Patient = mongoose.model('Patient', PatientSchema);
// export default Patient;

import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  patientName: {
    type: String,
    required: [true, 'Patient name is required.'],
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required.'],
    trim: true,
    unique: true // A contact number should be unique to a patient
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required.']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required.'],
    enum: ['Male', 'Female', 'Other']
  },
  // This will store the IDs of all appointments for this patient
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  // For the doctor's quick view, we can store the latest known stage
  latestDiseaseStage: {
      type: String,
      default: 'N/A'
  }
}, {
  timestamps: true
});

const Patient = mongoose.model('Patient', PatientSchema);
export default Patient;