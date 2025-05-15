import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ListEntity } from '../list/list.entity';
import { BoardResponseInterface } from './interfaces/board-response.interface';
import { BoardWithListsResponseInterface } from './interfaces/board-with-lists-response.interface';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  board_id: number;

  @Column() title: string;

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.boards)
  @JoinColumn({ name: 'user_id' })
  owner: UserEntity;

  @OneToMany(() => ListEntity, (list) => list.board)
  lists: ListEntity[];

  toResponseObject(): BoardResponseInterface {
    return {
      board_id: this.board_id,
      title: this.title,
      create_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  boardWithListsToResponseObject(): BoardWithListsResponseInterface {
    return {
      board_id: this.board_id,
      title: this.title,
      create_at: this.createdAt,
      updated_at: this.updatedAt,
      lists: this.lists.map((list) => ({
        title: list.title,
        position: list.position,
      })),
    };
  }
}
