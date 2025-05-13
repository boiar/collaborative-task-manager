import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from '../board/board.entity';
import { NotificationEntity } from "../notification/notification.entity";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn() user_id: number;

  @Column() name: string;

  @Column({ unique: true }) email: string;

  @Column() password: string;

  @OneToMany(() => BoardEntity, (board) => board.owner)
  boards: BoardEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications: NotificationEntity[];
}
