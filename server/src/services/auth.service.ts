import { AppDataSource } from "../models/typeorm.config";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
    private userRepository = AppDataSource.getRepository(User);

    async register(username: string, email: string, password: string) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            email,
            passwordHash: hashedPassword,
        });

        await this.userRepository.save(user);
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        // ✅ Await the bcrypt comparison


        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        };
    }
}
export function login(email: any, password: any) {
    throw new Error("Function not implemented.");
}

export function register(body: any) {
    throw new Error("Function not implemented.");
}

