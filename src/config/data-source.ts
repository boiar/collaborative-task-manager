import { DataSource } from 'typeorm';
import 'dotenv/config';
import { AuthSubscriber } from '../auth/auth.subscriber';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [__dirname + '/../migrations/*{.js,.ts}'],
  subscribers: [AuthSubscriber],
  synchronize: true,
});
