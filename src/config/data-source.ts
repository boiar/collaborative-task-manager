import { DataSource } from 'typeorm';
import 'dotenv/config';
import { UserEntity } from "../user/user.entity";
import { BoardEntity } from "../board/board.entity";
import { ListEntity } from "../list/list.entity";
import { CardEntity } from "../card/card.entity";

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity, BoardEntity, ListEntity, CardEntity], // Correct path for entities
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
