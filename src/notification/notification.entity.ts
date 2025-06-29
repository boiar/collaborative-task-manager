import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  message: string;

  @Column({ default: 'info' }) // Opts : info, alert, deadline
  type: string;

  @Column({ default: false })
  is_seen: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
