import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ListEntity } from '../list/list.entity';

@Entity('cards')
export class CardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() title: string;

  @Column({ nullable: true }) description: string;

  @Column({ type: 'datetime', nullable: true }) due_date: Date;

  @Column() position: number;

  @Column({ nullable: true }) file_path: string;

  @ManyToOne(() => ListEntity, (list) => list.cards)
  list: ListEntity;
}
