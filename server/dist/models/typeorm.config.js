"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "helpdisk_app",
    password: process.env.DB_PASSWORD || "secure_password_123",
    database: process.env.DB_NAME || "digital_help_disk",
    synchronize: true, // Set to false in production
    logging: true,
    entities: [__dirname + "/../**/*.model.ts"],
    migrations: [__dirname + "/../migrations/*.ts"],
    subscribers: [],
});
// Initialize the connection
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
