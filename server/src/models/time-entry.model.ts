import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Ticket } from './ticket.model';
import { User } from './user.model';

@Entity('time_entries')
export class TimeEntry {

}