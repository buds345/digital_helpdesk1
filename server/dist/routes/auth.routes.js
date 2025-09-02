"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
const registerSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
router.post("/register", async (req, res) => {
    try {
        const data = registerSchema.parse(req.body);
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
        const user = userRepo.create({ ...data, passwordHash: hashed });
        await userRepo.save(user);
        res.json({ message: "User registered", user });
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
});
exports.default = router;
