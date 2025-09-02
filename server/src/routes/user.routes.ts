import { Router } from "express";
import { getAllUsers, getUserById, updateUser } from "../controllers/user.controller";
import { User } from "../entities/user";
import { AppDataSource } from "../config/data-source";

const router = Router();

// GET all users (admin only)
router.get("/", getAllUsers);

// GET single user by ID
router.get("/:id", getUserById);

// UPDATE user by ID
router.put("/:id", updateUser);

// SOFT DELETE user by ID
router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Soft delete instead of removing
        user.isActive = false;
        await userRepository.save(user);

        res.status(200).json({ message: "User deactivated successfully" });
    } catch (error) {
        console.error("Error deactivating user:", error);
        res.status(500).json({ message: "Server error while deactivating user" });
    }
});

export default router;
