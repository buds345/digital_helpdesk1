import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await AppDataSource.getRepository(User).find({
            select: ["id", "name", "email", "role", "created_at", "updated_at"]
        });
        res.json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = await AppDataSource.getRepository(User).findOne({
            where: { id },
            select: ["id", "name", "email", "role", "created_at", "updated_at"]
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(User);
        const existingUser = await userRepo.findOne({ where: { id } });
        if (!existingUser) return res.status(404).json({ message: "User not found" });

        userRepo.merge(existingUser, req.body);
        const updatedUser = await userRepo.save(existingUser);
        res.json(updatedUser);
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete (deactivate) user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Option 1: Hard delete
        await userRepo.remove(user);

        // Option 2: Soft delete / deactivate
        // user.status = 'inactive';
        // await userRepo.save(user);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};
