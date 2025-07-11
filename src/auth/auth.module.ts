import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthSubscriber } from './auth.subscriber';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.APP_SECRET_KEY,
      signOptions: { expiresIn: '7d' },
    }),
    PassportModule,
    UserModule,
  ],
  providers: [AuthService, JwtStrategy, AuthSubscriber],
  controllers: [AuthController],
})
export class AuthModule {}
