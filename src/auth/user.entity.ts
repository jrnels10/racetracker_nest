import * as bcrypt from 'bcryptjs';
import { Event } from 'src/event/event.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  role: string;

  @Column({ nullable: true })
  homeTown: string;

  @Column({ length: 2, nullable: true })
  homeState: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(
    type => Event,
    event => event.user,
    { eager: true },
  )
  events: Event[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
