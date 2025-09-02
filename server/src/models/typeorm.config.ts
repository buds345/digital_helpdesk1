import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
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
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });