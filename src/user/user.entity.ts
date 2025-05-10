import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from '../board/board.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn() user_id: number;

  @Column() name: string;

  @Column({ unique: true }) email: string;

  @Column() password: string;

  @OneToMany(() => BoardEntity, (board) => board.owner)
  boards: BoardEntity[];
}
