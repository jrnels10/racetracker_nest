import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EventRegistration, EventStatus } from './event.enum';
// import { EventRegistration, EventStatus } from './event.model';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  location: string;
  @Column({ nullable: true })
  duration: number;
  @Column({ nullable: true })
  length: number;
  @Column({ nullable: true })
  date: Date;
  @Column()
  registration: EventRegistration;
  @Column()
  status: EventStatus;
}
