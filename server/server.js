import Appointment from './model/Appointment.js';
import express from 'express';
import cors from 'cors';
import connectDB from './DB/db.js';
import mongoose from 'mongoose';
import 'dotenv/config';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // Import necessary modules for ES6 pathing
import Patient from './model/PatientData.js'
import User from './model/User.js';
const app = express();
const PORT = process.env.PORT || 6000;
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // <-- 1. Import nodemailer


// --- FIX for __dirname in ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ---

// Middleware
app.use(express.json());
app.use(cors());
connectDB();

const upload = multer({ dest: 'uploads/' });

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Check for missing fields
    if (!username || !email || !password || !role) {
      return res.status(400).send('All fields (username, email, password, role) are required.');
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).send('User already exists with this email.'); // 409 Conflict
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // <-- Save the HASHED password
      role, // <-- Save the role
    });

    await newUser.save();

    // 5. Send success response
    // This matches your frontend alert: "Signup successful! OTP sent."
    // Note: This code doesn't actually send an email (that requires Nodemailer).
    res.status(200).send('Signup successful!!.');

  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Server error during signup.");
  }
});

// POST /api/login - User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Check for missing fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email: email });

    // 3. Check if user exists
    if (!user) {
      // Generic error for security (doesn't reveal if email or pass was wrong)
      return res.status(401).json({ message: 'Invalid email, password, or role' });
    }

    // 4. Compare the provided password with the stored hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // 5. Check if password and role match
    // We check both at the same time to avoid timing attacks
    if (!isPasswordMatch || user.role !== role) {
      return res.status(401).json({ message: 'Invalid email, password, or role' });
    }

    // 6. User is authenticated. Create a "safe" user object to send back.
    // --- IMPORTANT: Never send the password back, even the hash ---
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // 7. Create a JSON Web Token (JWT)
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    // --- !! IMPORTANT !! ---
    // Create a .env file in your project root and add:
    // JWT_SECRET=your_super_secret_key_here
    // Make sure to install dotenv: npm install dotenv
    // And require it at the top of your server file: require('dotenv').config();

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        
        // 8. Send the token and user data to the frontend
        // This matches the frontend code: localStorage.setItem('user', JSON.stringify(data.user));
        res.status(200).json({
          token,
          user: userResponse 
        });
      }
    );

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error during login.");
  }
});




// 1. FORGOT PASSWORD - REQUEST OTP
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.status(404).json({ message: 'User not found.' });
    }

    // This works on older Node.js versions
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // --- 2. Create Nodemailer Transporter ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // From .env
        pass: process.env.EMAIL_PASS, // From .env
      },
    });

    // --- 3. Define Email Options ---
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your Password Reset OTP',
      text: `Hello ${user.username},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP will expire in 10 minutes.\n`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3>Hello ${user.username},</h3>
          <p>You requested a password reset. Your One-Time Password (OTP) is:</p>
          <h1 style="color: #333; background: #f4f4f4; padding: 10px 20px; border-radius: 5px; display: inline-block;">
            ${otp}
          </h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    // --- 4. Send the Email ---
    await transporter.sendMail(mailOptions);

    // --- 5. Send Success Response (WITHOUT the OTP) ---
    res.status(200).json({ message: 'OTP has been sent to your email.' });

  } catch (error) {
    console.error('Error in /api/forgot-password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- API 2 (Unchanged, but provided for completeness) ---
// This API handles the reset after the user gets the OTP
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email: email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() } // $gt = greater than
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear the OTP fields
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });

  } catch (error)
 {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Your User Routes (Unchanged) ---
// app.post("/api/signup", async (req, res) => { /* ... */ });
// app.post("/api/login", async (req, res) => { /* ... */ });

// // History of patient
// // GET: Fetch all appointments (history) for a single patient
// app.get('/patient/:patientId/history', async (req, res) => {
//   try {
//     // Find all appointments for the given patientId, sort them with the newest first
//     const history = await Patient.find({ patientId: req.params.patientId })
//       .sort({ appointmentDate: -1 }); // -1 for descending order

//     if (!history) {
//       return res.status(404).json({ message: 'No history found for this patient.' });
//     }
//     res.status(200).json(history);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error fetching patient history.' });
//   }
// });

// // PUT: Update an appointment with a doctor's diagnosis
// app.put('/appointment/:appointmentId/diagnose', async (req, res) => {
//   try {
//     const { diagnosis, diseaseStage } = req.body;

//     const updatedAppointment = await Appointment.findByIdAndUpdate(
//       req.params.appointmentId,
//       {
//         diagnosis: diagnosis,
//         diseaseStage: diseaseStage,
//         status: 'Complete' // Mark the appointment as completed
//       },
//       { new: true } // This option returns the updated document
//     );

//     if (!updatedAppointment) {
//       return res.status(404).json({ message: 'Appointment not found.' });
//     }
//     res.status(200).json(updatedAppointment);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error updating diagnosis.' });
//   }
// });

// // Receptionist Dashboard
// app.post('/api/reception-dash', async (req, res) => {
//   try {
//     const {
//       patientId,
//       patientName,
//       contact, // <-- ADDED
//       dob,
//       age,
//       gender,
//       appointmentDate,
//       sugarLevel,
//       bp,
//       status,
//       reason
//     } = req.body;

//     const newPatient = new Patient({
//       patientId,
//       patientName,
//       contact, // <-- ADDED
//       dob,
//       age,
//       gender,
//       appointmentDate,
//       sugarLevel,
//       bp,
//       status,
//       reason
//     });

//     const savedPatient = await newPatient.save();

//     res.status(201).json({
//       message: 'Appointment booked successfully!',
//       patientId: savedPatient.patientId
//     });
//   } catch (error) {
//     console.error('Server Error:', error.message);
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Error: A record with this Patient ID already exists.' });
//     }
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ message: error.message });
//     }
//     res.status(500).json({ message: 'Server error. Please try again later.' });
//   }
// });

// // In your routes file (e.g., patientRoutes.js)
// app.get('/api/patients/search', async (req, res) => {
//   try {
//     const searchQuery = req.query.q;
//     if (!searchQuery) {
//       return res.status(400).json({ message: 'Search query is required.' });
//     }

//     const patients = await Patient.find({
//       $or: [
//         { patientName: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive regex search on name
//         { contact: { $regex: searchQuery, $options: 'i' } }      // Case-insensitive regex search on contact
//       ]
//     }).limit(10); // Limit results to prevent overload

//     res.json(patients);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error during patient search.' });
//   }
// });

// app.put('/appointment/:id', async (req, res) => {
//   try {
//     // Get the diagnosis details from the request body
//     const { diseaseStage, diseaseProbability } = req.body;

//     // Find the specific appointment by its unique MongoDB _id and update it
//     const updatedAppointment = await Patient.findByIdAndUpdate(
//       req.params.id, // The unique _id from the URL
//       {
//         diseaseStage: diseaseStage,
//         diseaseProbability: diseaseProbability,
//         status: 'Complete', // Automatically mark the appointment as 'Complete'
//       },
//       { new: true } // This option tells Mongoose to return the updated document
//     );

//     // If no record was found with that ID, send a 404 error
//     if (!updatedAppointment) {
//       return res.status(404).json({ message: 'Appointment record not found.' });
//     }

//     // Send a success response
//     res.status(200).json({
//       message: 'Diagnosis saved successfully!',
//       data: updatedAppointment
//     });

//   } catch (error) {
//     console.error('Error saving diagnosis:', error);
//     res.status(500).json({ message: 'Server error while saving diagnosis.' });
//   }
// });

// app.get('/api/patient/:patientId', async (req, res) => {
//   try {
//     const patient = await Patient.findOne({ patientId: req.params.patientId });
//     if (!patient) {
//       return res.status(404).json({ message: 'Patient not found' });
//     }
//     res.json(patient);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// // --- Prediction Endpoint (Updated) ---
app.post('/predict', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imagePath = req.file.path;

    // ================== CORRECTED PATH ==================
    // The '..' has been removed because 'retinopathy' is in the same directory as 'server.js'
    // ✅ Direct absolute path
    const pythonPath = "./DeepVision-oversampling/test.py";

    // ====================================================

    // This debug log will now print the correct path
    console.log(`[DEBUG] Attempting to find Python script at: ${pythonPath}`);

    if (!fs.existsSync(pythonPath)) {
        return res.status(500).json({ error: 'Server configuration error: Python script not found.' });
    }

    const pythonProcess = spawn('python', [pythonPath, imagePath]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        fs.unlink(imagePath, (err) => {
            if (err) console.error('Failed to delete temporary image file:', err);
        });

        if (errorData) {
            console.error('Python stderr:', errorData);
        }

        if (code !== 0) {
            console.error(`Python script exited with code ${code}`);
            return res.status(500).json({ error: 'Prediction script failed.', details: errorData });
        }

        try {
            const result = JSON.parse(outputData.trim());
            
            if (result.error) {
                console.error("Error from Python script:", result.error);
                return res.status(500).json({ error: result.error });
            }
            res.json(result);
        } catch (e) {
            console.error('JSON Parse Error:', e.message);
            console.error('Raw Python output:', outputData);
            res.status(500).json({ error: 'Failed to parse prediction output.', details: outputData });
        }
    });
});

// app.post('/api/savePatient', async (req, res) => {
//   try {
//     const { patientData, diseaseStage} = req.body;
//     const newPatient = new Patient({
//       patientData,
//       diseaseStage,
//     });
//     const savedPatient = await newPatient.save();
//     res.status(201).json(savedPatient);
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving patient data', error });
//   }
// });

// app.get('/api/patients', async (req, res) => {
//   try {
//     const patients = await Appointment.find();
//     console.log(patients);  
//     res.status(200).json(patients);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching patients', error });
//   }
// });

// // Make sure you have a route to GET all patients
// app.get('/api/patients', async (req, res) => {
//   try {
//     const patients = await Appointment.find({}); // Fetches all documents
//     console.log(patients);
    
//     res.status(200).json(patients);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching patients", error });
//   }
// });

// // On your Node.js/Express server...
// // app.post('/api/reception-dash', async (req, res) => {
// //   const { patientName, dateOfBirth, contact, appointmentDate, reason } = req.body;

// //   try {
// //     let patient = await Patient.findOne({ name: patientName, dateOfBirth: dateOfBirth });

// //     if (!patient) {
// //       // THIS IS THE ID GENERATION LOGIC
// //       const dob = new Date(dateOfBirth);
// //       const day = String(dob.getDate()).padStart(2, '0');
// //       const month = String(dob.getMonth() + 1).padStart(2, '0');
// //       const year = dob.getFullYear();
// //       const dobPrefix = `${day}${month}${year}`;

// //       const existingCount = await Patient.countDocuments({ patientId: new RegExp(`^${dobPrefix}-`) });
// //       const sequenceNumber = String(existingCount + 1).padStart(2, '0');
// //       const patientId = `${dobPrefix}-${sequenceNumber}`; // e.g., "18042003-01"

// //       // Create and save the new patient
// //       patient = new Patient({ patientId, name: patientName, dateOfBirth, contact });
// //       await patient.save();
// //     }
    
// //     // Create the appointment using the found or newly created patient's ID
// //     const newAppointment = new Appointment({
// //       patientId: patient.patientId,
// //       patientName,
// //       appointmentDate,
// //       reason,
// //     });
    
// //     await newAppointment.save();
// //     res.status(201).json(newAppointment);

// //   } catch (error) {
// //     res.status(500).json({ message: 'Server error.' });
// //   }
// // });



// app.put('/api/patients/:id', async (req, res) => {
//   try {
//     const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedPatient) throw new Error('Patient not found');
//     res.status(200).json(updatedPatient);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating patient', error });
//   }
// });

// app.get('/api/viewappoint', async (req, res) => {
// try {
//     // Fetch all documents from the Patient collection
//     // .sort({ createdAt: -1 }) will show the newest appointments first
//     const appointments = await Patient.find({}).sort({ createdAt: -1 });
    
//     // Send the array of appointments as a JSON response
//     res.json(appointments);

//   } catch (error) {
//     console.error('Server Error:', error.message);
//     res.status(500).json({ message: 'Server error while fetching appointments.' });
//   }
// });

// // This code goes in your backend API route
// // GET /api/history/:patientId

// app.get('/api/history/:patientId', async (req, res) => {
//   try {
//     const { patientId } = req.params;

//     // Find all records where 'patientData.patientId' matches the one from the URL
//     // .sort({ 'patientData.date': -1 }) shows the newest records first
//     const patientHistory = await Patient.find({ 
//       'patientData.patientId': patientId 
//     }).sort({ 'patientData.date': -1 });

//     if (!patientHistory) {
//       return res.status(404).json({ message: 'No history found for this patient.' });
//     }
    
//     // Send the array of historical records back to the frontend
//     res.json(patientHistory);

//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// app.delete('/api/patients/:id', async (req, res) => {
//   try {
//     // Find and delete the patient by patientId from patientData
//     const deletedPatient = await Patient.findOneAndDelete({ 'patientData.patientId': req.params.patientId });
//     if (!deletedPatient) throw new Error('Patient not found');
//     res.status(200).json({ message: 'Patient deleted successfully', deletedPatient });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting patient', error: error.message });
//   }
// });

// app.post('/api/reception-dash', async (req, res) => {
//   try {
//     // Destructure the expected fields from the request body
//     const { patientName, age, contact, appointmentDate } = req.body;

//     // Basic validation to ensure required fields are present
//     if (!patientName || !age || !contact || !appointmentDate) {
//       return res.status(400).json({ message: 'Please provide all required fields.' });
//     }

//     // Create a new appointment instance using the Mongoose model
//     const newAppointment = new Appointment({
//       patientName,
//       age,
//       contact,
//       appointmentDate,
//       // The 'status' field will automatically default to 'Upcoming'
//       // as defined in your schema, so you don't need to send it from the frontend.
//     });

//     // Save the new appointment to the database
//     const savedAppointment = await newAppointment.save();

//     // Respond with a 201 (Created) status and the saved document
//     res.status(201).json(savedAppointment);

//   } catch (error) {
//     // If an error occurs during the process, send a 500 status code
//     console.error('Server Error:', error.message);
//     res.status(500).json({ message: 'Error booking appointment', error: error.message });
//   }
// });

// Start server

// This is your complete, cleaned-up server code.
// No more duplicate routes.

/**
 * @desc    Search for patients by name or contact
 * @route   GET /api/patients/search
 */
// app.get('/api/patients/search', async (req, res) => {
//   try {
//     const query = req.query.q;
//     if (!query) {
//       return res.status(200).json([]);
//     }
//     const patients = await Patient.find({
//       $or: [
//         { patientName: { $regex: query, $options: 'i' } },
//         { contact: { $regex: query, $options: 'i' } },
//       ],
//     })
//     .select('_id patientId patientName contact dob gender') 
//     .limit(10);

//     res.status(200).json(patients);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error while searching for patients.' });
//   }
// });


// /**
//  * @desc    Book a new appointment (handles both new and existing patients)
//  * @route   POST /api/appointments
//  */
// app.post('/api/appointments', async (req, res) => {
//   // ✅ **THE FIX IS HERE**: All fields from the form are now correctly destructured.
//   const {
//     patientMongoId,
//     patientId,
//     patientName,
//     contact,
//     dob,
//     gender,
//     appointmentDate,
//     sugarLevel,
//     bp,
//     reason
//   } = req.body;

//   if (!patientName || !contact || !dob || !appointmentDate || !sugarLevel || !bp || !reason) {
//       return res.status(400).json({ message: 'Please fill all required fields.' });
//   }

//   try {
//     let patient;

//     if (patientMongoId) {
//       // Find existing patient
//       patient = await Patient.findById(patientMongoId);
//        if (!patient) {
//         return res.status(404).json({ message: 'Existing patient not found.' });
//       }
//     } else {
//       // Create new patient
//       if (!patientId) {
//           return res.status(400).json({ message: 'Patient ID is required for new patients.' });
//       }
//       const existingPatientByContact = await Patient.findOne({ contact });
//       if (existingPatientByContact) {
//         return res.status(409).json({ message: 'A patient with this contact number already exists.' });
//       }
//       patient = new Patient({ patientId, patientName, contact, dob, gender });
//       await patient.save();
//     }

//     // Now all variables are defined and can be used here
//     const newAppointment = new Appointment({
//       patient: patient._id,
//       patientId: patient.patientId,
//       appointmentDate,
//       sugarLevel,
//       bp,
//       reason,
//     });
//     await newAppointment.save();

//     patient.appointments.push(newAppointment._id);
//     await patient.save();
    
//     res.status(201).json({
//         message: 'Appointment booked successfully!',
//         patientId: patient.patientId
//     });

//   } catch (error) {
//     console.error(error);
//     if (error.code === 11000) {
//         return res.status(409).json({ message: 'A duplicate patient record was detected.' });
//     }
//     res.status(500).json({ message: 'Server error while booking appointment.' });
//   }
// });

// // GET: Fetch all appointments
// app.get('/api/appointmentdetails', async (req, res) => {
//   try {
//     const appointments = await Appointment.find({})
//       .populate('patient')
//       .sort({ appointmentDate: -1 }); // Sort by newest first
//     console.log("AppoitmentDeatails",appointments);
    
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ message: 'Server error while fetching appointments.' });
//   }
// });


// /**
//  * @desc    Get a single patient's complete history
//  * @route   GET /api/patients/:id/history
//  */
// app.get('/api/patients/:id/history', async (req, res) => {
//     try {
//         const patient = await Patient.findById(req.params.patientId)
//             .populate({
//                 path: 'appointments',
//                 options: { sort: { 'appointmentDate': -1 } }
//             });

//         if (!patient) {
//             return res.status(404).json({ message: 'Patient not found.' });
//         }
//         res.status(200).json(patient);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error fetching patient history.' });
//     }
// });

// Bhai bhai


// GET: Search for patients
app.get('/api/patients/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(200).json([]);
    }
    const patients = await Patient.find({
      $or: [
        { patientName: { $regex: query, $options: 'i' } },
        { contact: { $regex: query, $options: 'i' } },
      ],
    })
    .select('_id patientId patientName contact dob gender') 
    .limit(10);

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error while searching for patients.' });
  }
});

// POST: Book a new appointment
app.post('/api/appointments', async (req, res) => {
  const {
    patientMongoId,
    patientId,
    patientName,
    contact,
    dob,
    gender,
    appointmentDate,
    sugarLevel,
    bp,
    reason
  } = req.body;

  if (!patientName || !contact || !dob || !appointmentDate || !sugarLevel || !bp || !reason) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  try {
    let patient;

    if (patientMongoId) {
      patient = await Patient.findById(patientMongoId);
       if (!patient) {
        return res.status(404).json({ message: 'Existing patient not found.' });
      }
    } else {
      if (!patientId) {
          return res.status(400).json({ message: 'Patient ID is required for new patients.' });
      }
      const existingPatientByContact = await Patient.findOne({ contact });
      if (existingPatientByContact) {
        return res.status(409).json({ message: 'A patient with this contact number already exists.' });
      }
      patient = new Patient({ patientId, patientName, contact, dob, gender });
      await patient.save();
    }

    const newAppointment = new Appointment({
      patient: patient._id,
      patientId: patient.patientId,
      appointmentDate,
      sugarLevel,
      bp,
      reason,
    });
    await newAppointment.save();

    patient.appointments.push(newAppointment._id);
    await patient.save();
    
    res.status(201).json({
        message: 'Appointment booked successfully!',
        patientId: patient.patientId
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(409).json({ message: 'A duplicate patient record was detected.' });
    }
    res.status(500).json({ message: 'Server error while booking appointment.' });
  }
});

// GET: Fetch all appointments for the slideshow
app.get('/api/appointmentdetails', async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient')
      .sort({ appointmentDate: -1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
});


// --- NEW AND FIXED ROUTES FOR PatientDashboardPage ---

/**
 * @desc    Get a single patient's details (NEEDED BY DASHBOARD)
 * @route   GET /api/patient/:patientId
 * @fix     This route was missing.
 */
app.get('/api/patient/:patientId', async (req, res) => {
  try {
    // Use patientId (the string ID) to find the patient
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching patient details.' });
  }
});


/**
 * @desc    Get a single patient's appointment history (NEEDED BY DASHBOARD)
 * @route   GET /api/patient/:patientId/history
 * @fix     Your route was /api/patients/:id/history (plural, 'id')
 * The frontend fetches /api/patient/:patientId/history (singular, 'patientId')
 * This now matches the frontend fetch.
 */
app.get('/api/patient/:patientId/history', async (req, res) => {
    try {
      // Find all appointments matching the string patientId
      const appointments = await Appointment.find({ patientId: req.params.patientId })
          .sort({ 'appointmentDate': -1 }); // Sort by newest first

      if (!appointments) {
          // Send empty array instead of 404, as a patient might have no history
          return res.status(200).json([]);
      }
      res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching patient history.' });
    }
});


/**
 * @desc    Update an appointment with diagnosis (NEEDED BY DASHBOARD)
 * @route   PUT /api/appointment/:appointmentId
 * @fix     This route was missing. It's needed for the "Save" button.
 */
app.put('/api/appointment/:appointmentId', async (req, res) => {
  try {
    const { diseaseStage, diseaseProbability, status } = req.body;
    
    // The :appointmentId is the MongoDB _id
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Update the fields
    appointment.diseaseStage = diseaseStage;
    appointment.diseaseProbability = diseaseProbability;
    appointment.status = status; // e.g., "Complete"

    await appointment.save();

    res.status(200).json(appointment);

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error updating appointment.' });
  }
});

app.get('/api/patient/:patientId', async (req, res) => {
  try {
    // Use patientId (the string ID like '101130-19910716') to find the patient
    const patient = await Patient.findOne({ patientId: req.params.patientId });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient details:', error);
    res.status(500).json({ message: 'Server error fetching patient details.' });
  }
});


/**
 * @desc    2. Get a single patient's appointment history
 * @route   GET /api/patient/:patientId/history
 * @uses    Fetches the data for the "Visit History" timeline
 */
app.get('/api/patient/:patientId/history', async (req, res) => {
    try {
      // Find all appointments matching the string patientId
      const appointments = await Appointment.find({ patientId: req.params.patientId })
          .sort({ 'appointmentDate': -1 }); // Sort by newest first

      if (!appointments) {
          // Send empty array instead of 404
          return res.status(200).json([]);
      }
      res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching patient history:', error);
        res.status(500).json({ message: 'Server error fetching patient history.' });
    }
});


/**
 * @desc    3. Update an appointment with diagnosis (THE KEY FOR "SAVE")
 * @route   PUT /api/appointment/:appointmentId
 * @uses    Called when you click the "Save" button
 */
app.put('/api/appointment/:appointmentId', async (req, res) => {
 try {
  const { diseaseStage, diseaseProbability, status } = req.body;
  const appointment = await Appointment.findById(req.params.appointmentId);

  appointment.diseaseStage = diseaseStage;
  appointment.diseaseProbability = diseaseProbability; // <-- This line fails if schema is missing the field
  appointment.status = status;

  await appointment.save(); // <-- This is where the 500 error happens
  res.status(200).json(updatedAppointment);

} catch (error) {
  // The error is caught here, and a 500 is sent to the frontend
  console.error('Error updating appointment:', error); 
  res.status(500).json({ message: 'Server error updating appointment.' });
}
});

app.delete('/api/appointment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check for a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Appointment ID' });
    }

    // Find and delete the appointment
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // --- Data Integrity Step ---
    // Remove the deleted appointment's ID from the patient's 'appointments' array
    if (deletedAppointment.patient) {
      await Patient.updateOne(
        { _id: deletedAppointment.patient },
        { $pull: { appointments: deletedAppointment._id } }
      );
    }

    res.status(200).json({ message: 'Appointment deleted successfully' });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error while deleting appointment.' });
  }
});




// ✅ 1. MODIFY THIS ROUTE
// GET: Fetch all appointments for the table
app.get('/api/appointmentdetails', async (req, res) => {
  try {
    // This now finds all appointments that are NOT archived
    const appointments = await Appointment.find({ isArchived: false }) 
      .populate('patient')
      .sort({ appointmentDate: -1 });
    
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error while fetching appointments.' });
  }
});


// ✅ 2. REPLACE your DELETE route with this PUT route
// (You can delete your old app.delete('/api/appointment/:id') route)

/**
 * @desc    Archive a specific appointment (Soft Delete)
 * @route   PUT /api/appointment/archive/:id
 */
app.put('/api/appointment/archive/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Appointment ID' });
    }

    // Find the appointment and set isArchived to true
    const archivedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { isArchived: true },
      { new: true } // Return the updated document
    );

    if (!archivedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ 
      message: 'Appointment archived successfully', 
      appointment: archivedAppointment 
    });

  } catch (error) {
    console.error('Error archiving appointment:', error);
    res.status(500).json({ message: 'Server error while archiving appointment.' });
  }
});

// ... (all your imports: express, mongoose, Appointment, Patient, etc.) ...

// GET: Fetch ONLY ARCHIVED appointments
app.get('/api/appointments/archived', async (req, res) => {
  try {
    const archivedAppointments = await Appointment.find({ isArchived: true }) // Find where isArchived is true
      .populate('patient')
      .sort({ updatedAt: -1 }); // Sort by when they were archived (most recent first)

    res.status(200).json(archivedAppointments);
  } catch (error) {
    console.error('Error fetching archived appointments:', error);
    res.status(500).json({ message: 'Server error while fetching archived appointments.' });
  }
});

// ✅ NEW: ROUTE TO UPDATE AN APPOINTMENT
// ✅ NEW: ROUTE TO UPDATE AN APPOINTMENT (WITH 2 FIXES)
app.put('/api/appointment/update/:id', async (req, res) => { // <-- FIX 1: Added '/api' prefix
  try {
    const { id } = req.params;
    
    // Get the new data from the request body
    const { appointmentDate, reason, sugarLevel, bp, status } = req.body;

    // Find the appointment by ID and update it
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        appointmentDate,
        reason,
        sugarLevel,
        bp,
        status
      },
      { new: true } // This option returns the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ✅ --- FIX 2 ---
    // You must find the appointment by its unique _id to populate it.
    const populatedAppointment = await Appointment.findById(updatedAppointment._id)
                                                  .populate('patient');

    res.status(200).json(populatedAppointment); // Send back the full, updated appointment

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error updating appointment' });
  }
});

// ... (all your other existing routes: /api/appointmentdetails, /api/appointment/archive/:id, etc.) ...

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});