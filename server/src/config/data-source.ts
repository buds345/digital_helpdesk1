import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Entities - use correct imports
import { User } from "../entities/user"; // Capital U
import { Ticket } from "../entities/Ticket";
import { Comment } from "../entities/Comment";
import { Service } from "../entities/Services";
import { BaseEntity } from "../BaseEntity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "Yheewena32!",
  database: process.env.DB_NAME || "digital_help_desk",
  entities: [User, Ticket, Comment, Service, BaseEntity],
  synchronize: true,
  logging: true, // Enable logging to see SQL queries
  migrations: [],
  subscribers: [],
});