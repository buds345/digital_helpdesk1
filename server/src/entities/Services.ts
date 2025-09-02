// src/entities/Service.ts
import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { Ticket } from "./Ticket";

@Entity("services")
export class Service extends BaseEntity {
    @Column()
    name!: string;

    @Column("text", { nullable: true })
    description!: string | null;

    @OneToMany(() => Ticket, (ticket) => ticket.service)
    tickets!: Ticket[];
}
