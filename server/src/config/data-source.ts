import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Entities
import { User } from "../entities/user";   // Ensure correct casing
import { Ticket } from "../entities/Ticket";
import { Comment } from "../entities/Comment";
import { Service } from "../entities/Services";
import { BaseEntity } from "../BaseEntity";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Ticket, Comment, Service, BaseEntity],
  synchronize: true,
  logging: true,
});
