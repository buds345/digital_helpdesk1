import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseModel } from './base.model';
import { Ticket } from './ticket.model';

export enum UserRole {
    ADMIN = 'admin',
    TECHNICIAN = 'technician',
    CLIENT = 'client',
}

@Entity('users')
export class User extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ unique: true })
    username: string | undefined;

    @Column({ unique: true })
    email: string | undefined;

    @Column()
    password: string | undefined; // store hashed password

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    })
    role: UserRole | undefined;

    @OneToMany(() => Ticket, (ticket) => ticket.user)
    tickets: Ticket[] | undefined;
    name: any;
}
