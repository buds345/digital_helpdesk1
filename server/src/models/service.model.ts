import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from './base.model';
import { Ticket } from './ticket.model';

@Entity('services')
export class Service extends BaseModel {

}