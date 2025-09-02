import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "./user";
import { Service } from "./Services";
import { Comment } from "./Comment";

export enum TicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    WAITING_ON_CLIENT = "waiting_on_client",
    RESOLVED = "resolved",
    CLOSED = "closed",
    UNASSIGNED = "unassigned",
    UNKNOWN = "unknown",
}

export enum TicketPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical",
}

@Entity("tickets")
export class Ticket extends BaseEntity {
    @Column()
    title!: string;

    @Column("text")
    description!: string;

    @Column({
        type: "enum",
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status!: TicketStatus;

    @Column({
        type: "enum",
        enum: TicketPriority,
        default: TicketPriority.MEDIUM,
    })
    priority!: TicketPriority;

    // Assigned support staff (nullable)
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "assigned_to_id" })
    assignedTo!: User | null;

    // Ticket creator / client
    @ManyToOne(() => User)
    @JoinColumn({ name: "client_id" })
    client!: User;

    // Related service
    @ManyToOne(() => Service)
    @JoinColumn({ name: "service_id" })
    service!: Service;

    // Comments
    @OneToMany(() => Comment, (comment) => comment.ticket)
    comments!: Comment[];
    creatorId: any;
}
