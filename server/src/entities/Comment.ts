import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user";
import { Ticket } from "./Ticket";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    body!: string;

    @ManyToOne(() => User, (user: { comments: any; }) => user.comments)
    author!: User;

    @ManyToOne(() => Ticket, (ticket) => ticket.comments)
    ticket!: Ticket;
    user: any;
}
