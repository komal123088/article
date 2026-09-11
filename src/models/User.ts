import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // not required for Google sign-in accounts
    role: { type: String, enum: ["user", "admin"], default: "user" },
    authProvider: { type: String, enum: ["credentials", "google"], default: "credentials" },

    // Email OTP verification (only relevant for "credentials" accounts —
    // Google accounts are considered verified automatically)
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
