// import express from 'express';
// import cors from 'cors';
// import connectDB from './DB/db.js'; // Import the DB connection
// import 'dotenv/config'; // Load environment variables
// import User from './model/User.js';


// const app = express();
// const PORT = process.env.PORT || 6000;  // ✅ use process.env

// // Middleware
// app.use(express.json());

// // Enable CORS
// app.use(cors()); 

// // Connect to Database
// connectDB();

// // Temporary in-memory store for OTPs
// const otpStore = {};

// // Sample route
// app.post("/api/signup", async(req, res) => {

//   console.log("Received Signup Request:", req.body);
//   const { email, username, password} = req.body;

//   if (!email || !username || !password) {
//     return res.status(400).json({ message: "All fields,are required." });
//   }

//   const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//   if (existingUser) {
//     return res.status(400).json({ message: "Email or Username already exists" });
//   }

//     const newUser = new User({ username, email, password});
//       await newUser.save();
//       console.log("Saved User:", newUser); // Debug log
      
//       res.status(201).send("User signed up successfully");
// });

// // 📌 Verify OTP & Create User
// // app.post("/api/verify-otp", async (req, res) => {
// //   const { email, otp, username, password} = req.body;

// //   console.log("Received Verify OTP Request:", req.body); // Debug log

// //   if (otpStore[email] === otp) {
// //     try {
// //       if (!email || !username || !password) {
// //         return res.status(400).send("All fields, including a non-empty category array, are required.");
// //       }

// //       const existingUser = await User.findOne({ $or: [{ email }, { username }] });

// //       if (existingUser) {
// //         return res.status(400).send("Email or Username already exists");
// //       }

// //       const newUser = new User({ username, email, password});
// //       await newUser.save();
// //       console.log("Saved User:", newUser); // Debug log

// //       delete otpStore[email];
// //       res.status(201).send("User signed up successfully");
// //     } catch (error) {
// //       console.error("Error signing up user:", error);
// //       res.status(500).send("Error signing up user");
// //     }
// //   } else {
// //     res.status(400).send("Invalid OTP");
// //   }
// // });

// //  User Login
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email, password });
//     if (user) {
//       res.status(200).json({ user });
//     } else {
//       res.status(400).json({ message: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     res.status(500).json({ message: "Error logging in user", error: error.message });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });