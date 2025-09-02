"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const cors_1 = __importDefault(require("cors"));
const User_js_1 = require("./entities/User.js");
const Ticket_js_1 = require("./entities/Ticket.js");
const Comment_js_1 = require("./entities/Comment.js");
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const ticket_routes_js_1 = __importDefault(require("./routes/ticket.routes.js"));
const comment_routes_js_1 = __importDefault(require("./routes/comment.routes.js"));
// Create TypeORM DataSource
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root", // change to your MySQL username
    password: "password", // change to your MySQL password
    database: "helpdesk", // change to your database name
    synchronize: true, // auto creates tables (use only in dev!)
    logging: false,
    entities: [User_js_1.User, Ticket_js_1.Ticket, Comment_js_1.Comment],
    migrations: [],
    subscribers: [],
});
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/tickets", ticket_routes_js_1.default);
app.use("/api/comments", comment_routes_js_1.default);
// Start server only after DB connection
exports.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ Database connection failed:", err);
});
exports.default = app;
