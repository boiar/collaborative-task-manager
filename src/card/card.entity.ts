import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListEntity } from '../list/list.entity';
import { CardResponseInterface } from './interfaces/card-response.interface';
import 'dotenv/config';

@Entity('cards')
export class CardEntity {
  @PrimaryGeneratedColumn()
  card_id: number;

  @Column() title: string;

  @Column({ nullable: true }) description: string;

  @Column({ type: 'datetime', nullable: true }) due_date: Date;

  @Column() position: number;

  @Column({ nullable: true }) file_path: string;

  @ManyToOne(() => ListEntity, (list) => list.cards)
  @JoinColumn({ name: 'list_id' })
  list: ListEntity;

  toResponseObject(): CardResponseInterface {
    const baseUrl = process.env.FILE_BASE_URL || 'http://localhost:3000';
    const filePath = this.file_path ? `${baseUrl}/${this.file_path}` : null;

    return {
      card_id: this.card_id,
      title: this.title,
      due_to: this.due_date,
      position: this.position,
      file_path: filePath, // edit file path
      list: {
        list_id: this.list?.list_id,
        title: this.list?.title,
      },
    };
  }
}
