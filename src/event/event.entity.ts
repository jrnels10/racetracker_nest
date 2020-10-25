import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @ManyToOne(
    type => User,
    user => user.events,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
