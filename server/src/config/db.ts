import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/user.model";
import { Ticket } from "../models/ticket.model";


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3307,
    username: "root",
    password: "Yheewena32!",
    database: "digital_help_disk",
    synchronize: true,
    logging: false,
    entities: [User, Ticket, Comment],
});
