import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { BoardEntity } from '../board/board.entity';
import { CardEntity } from '../card/card.entity';

@Entity('lists')
export class ListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;

  @Column() position: number;

  @ManyToOne(() => BoardEntity, (board) => board.lists)
  board: BoardEntity;

  @OneToMany(() => CardEntity, (card) => card.list)
  cards: CardEntity[];
}
