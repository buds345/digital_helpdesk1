import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { User } from './user.model';
import { Service } from './service.model';

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    WAITING_ON_CLIENT = 'waiting_on_client',
    RESOLVED = 'resolved',
    CLOSED = 'closed'
}

export enum TicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

@Entity('tickets')
export class Ticket extends BaseModel {
    @Column()
    title!: string;

    @Column('text')
    description!: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN
    })
    status!: TicketStatus;

    @Column({
        type: 'enum',
        enum: TicketPriority,
        default: TicketPriority.MEDIUM
    })
    priority!: TicketPriority;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assigned_to_id' })
    assignedTo?: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'client_id' })
    client!: User;

    @ManyToOne(() => Service)
    @JoinColumn({ name: 'service_id' })
    service!: Service;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt?: Date;
    user: any;
}