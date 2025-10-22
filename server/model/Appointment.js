import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  // This is the primary link using MongoDB's internal _id
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  
  // ✅ ADDED: The custom, human-readable patient ID for easy reference
  patientId: {
    type: String,
    required: true,
    trim: true
  },
  isArchived: {
    type: Boolean,
    default: false // By default, nothing is archived
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  sugarLevel: {
    type: String,
    required: true
  },
  bp: { // Blood Pressure
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  // Details filled in by the doctor after diagnosis
  diagnosisNotes: {
    type: String
  },
  diseaseStage: {
    type: String
  },
  diseaseProbability: {
    type: String 
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);
export default Appointment;