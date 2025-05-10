import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from '../user/user.entity';
import { ListEntity } from '../list/list.entity';

@Entity('boards')
export class BoardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() name: string;

  @Column({ nullable: true }) description: string;

  @ManyToOne(() => UserEntity, (user) => user.boards)
  owner: UserEntity;

  @OneToMany(() => ListEntity, (list) => list.board)
  lists: ListEntity[];
}
