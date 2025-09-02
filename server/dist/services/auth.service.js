"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
exports.login = login;
exports.register = register;
const typeorm_config_1 = require("../models/typeorm.config");
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    userRepository = typeorm_config_1.AppDataSource.getRepository(user_model_1.User);
    async register(username, email, password) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = this.userRepository.create({
            username,
            email,
            passwordHash: hashedPassword,
        });
        await this.userRepository.save(user);
        return user;
    }
    async login(email, password) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // ✅ Await the bcrypt comparison
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
exports.AuthService = AuthService;
function login(email, password) {
    throw new Error("Function not implemented.");
}
function register(body) {
    throw new Error("Function not implemented.");
}
