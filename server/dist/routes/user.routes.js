"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Example user management routes
router.get("/", user_controller_1.getAllUsers); // GET all users
router.get("/:id", user_controller_1.getUserById); // GET user by ID
router.put("/:id", user_controller_1.updateUser); // UPDATE user
router.delete("/:id", user_controller_1.deleteUser); // DELETE user
exports.default = router;
