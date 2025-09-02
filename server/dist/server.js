"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const data_source_1 = require("./data-source");
const ticket_routes_1 = __importDefault(require("./routes/ticket.routes"));
const comment_routes_1 = require("./routes/comment.routes");
const error_1 = require("./utils/error");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.get("/", (_, res) => res.json({ ok: true, service: "helpdesk-api" }));
exports.app.use("/api/tickets", ticket_routes_1.default);
exports.app.use("/api/comments", comment_routes_1.commentRouter);
exports.app.use(error_1.errorHandler);
// Initialize DB right away
data_source_1.AppDataSource.initialize()
    .then(() => console.log("✅ MySQL connected"))
    .catch((e) => {
    console.error("❌ DB init error:", e);
    process.exit(1);
});
