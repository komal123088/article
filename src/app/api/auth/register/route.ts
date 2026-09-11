import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendOtpEmail, generateOtp } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing && existing.isVerified) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // If an unverified account already exists (user never completed OTP
    // step), update it instead of creating a duplicate.
    const user = existing
      ? await User.findByIdAndUpdate(
          existing._id,
          { name, password: hashedPassword, otpCode: otp, otpExpiresAt },
          { new: true }
        )
      : await User.create({
          name,
          email: email.toLowerCase(),
          password: hashedPassword,
          otpCode: otp,
          otpExpiresAt,
        });

    await sendOtpEmail(user.email, otp);

    return NextResponse.json({ email: user.email, message: "Verification code sent." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
