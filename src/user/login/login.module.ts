import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LoginController } from './login.controller';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from '../user.service';
import { SignInUseCase } from '../../auth/useCases/sing-in.usecase';
import { JwtModule } from '@nestjs/jwt';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => LoginModule),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),KafkaModule
  ],

  controllers: [LoginController],
  providers: [UserService, SignInUseCase],
})
export class LoginModule {}
