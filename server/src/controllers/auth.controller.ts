import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailService } from "../services/emailService";

const userRepo = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await userRepo.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = emailService.generateVerificationToken();
        const verificationExpires = new Date();
        verificationExpires.setHours(verificationExpires.getHours() + 24); // 24 hours

        const user = userRepo.create({
            name,
            email,
            password: hashedPassword,
            role,
            emailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: verificationExpires,
        });

        await userRepo.save(user);

        // Send verification email
        try {
            await emailService.sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Don't fail registration if email fails, but log it
        }

        return res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account.",
            emailSent: true
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userRepo.findOneBy({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in",
                emailNotVerified: true,
                email: user.email
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({ message: "Account is deactivated" });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update your verifyEmail function in auth.controller.ts
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        console.log('🔍 Verification attempt with token:', token);

        if (!token) {
            console.log('❌ No token provided');
            return res.status(400).json({ message: "Verification token is required" });
        }

        const user = await userRepo.findOne({
            where: { emailVerificationToken: token }
        });

        console.log('🔍 User found:', user ? `${user.email} (ID: ${user.id})` : 'None');

        if (!user) {
            console.log('❌ Invalid token - no user found');
            return res.status(400).json({ message: "Invalid verification token" });
        }

        // Check if already verified
        if (user.emailVerified) {
            console.log('✅ Email already verified for user:', user.email);
            return res.json({
                message: "Email is already verified! You can now log in.",
                verified: true
            });
        }

        // Check if token has expired
        if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
            console.log('❌ Token expired for user:', user.email);
            return res.status(400).json({ message: "Verification token has expired" });
        }

        // Verify the user
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;

        await userRepo.save(user);
        console.log('✅ Email verified successfully for user:', user.email);

        // Send welcome email
        try {
            await emailService.sendWelcomeEmail(user.email, user.name);
            console.log('✅ Welcome email sent to:', user.email);
        } catch (emailError) {
            console.error('❌ Welcome email failed:', emailError);
        }

        return res.json({
            message: "Email verified successfully! You can now log in.",
            verified: true
        });
    } catch (error) {
        console.error("❌ Email verification error:", error);
        return res.status(500).json({ message: "Server error during verification" });
    }
};