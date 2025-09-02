"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.getCurrentUser = void 0;
const typeorm_config_1 = require("../models/typeorm.config");
const user_model_1 = require("../models/user.model");
// Get the currently logged-in user
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; // assuming middleware sets req.userId
        const userRepository = typeorm_config_1.AppDataSource.getRepository(user_model_1.User);
        const user = await userRepository.findOne({
            where: { id: userId },
            select: ["id", "username", "email", "role"] // exclude password
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
    catch (error) {
        console.error("Error in getCurrentUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCurrentUser = getCurrentUser;
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const userRepository = typeorm_config_1.AppDataSource.getRepository(user_model_1.User);
        const users = await userRepository.find({ select: ["id", "username", "email", "role"] });
        res.json({ users });
    }
    catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getAllUsers = getAllUsers;
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepository = typeorm_config_1.AppDataSource.getRepository(user_model_1.User);
        const user = await userRepository.findOne({
            where: { id: parseInt(id) },
            select: ["id", "username", "email", "role"]
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    }
    catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getUserById = getUserById;
// Update user by ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepository = typeorm_config_1.AppDataSource.getRepository(user_model_1.User);
        const existingUser = await userRepository.findOne({ where: { id: parseInt(id) } });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        userRepository.merge(existingUser, req.body); // merge updated fields
        const result = await userRepository.save(existingUser);
        res.json({ user: result });
    }
    catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateUser = updateUser;
// Delete user by ID
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userRepository = typeorm_config_1.AppDataSource.getRepository(user_model_1.User);
        const user = await userRepository.findOne({ where: { id: parseInt(id) } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await userRepository.remove(user);
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteUser = deleteUser;
