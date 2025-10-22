import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true }, // ✅ Added role field
  // --- ADD THESE TWO FIELDS ---
    resetPasswordOTP: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

const User = mongoose.model("User", UsersSchema);
export default User;