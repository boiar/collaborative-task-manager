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

import { BoardEntity } from '../board/board.entity';
import { CardEntity } from '../card/card.entity';
import { ListResponseInterface } from './interfaces/list-response.interface';
import { Optional } from "@nestjs/common";

@Entity('lists')
export class ListEntity {
  @PrimaryGeneratedColumn()
  list_id: number;

  @Column() title: string;

  @Column() @Optional() position: number;

  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date;

  @ManyToOne(() => BoardEntity, (board) => board.lists)
  @JoinColumn({ name: 'board_id' })
  board: BoardEntity;

  @OneToMany(() => CardEntity, (card) => card.list)
  cards: CardEntity[];

  toResponseObject(): ListResponseInterface {
    return {
      list_id: this.list_id,
      title: this.title,
      position: this.position,
      create_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
