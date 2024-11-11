import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LoginController } from './login.controller';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from '../user.service';
import { SignInUseCase } from 'src/auth/useCases/sing-in.usecase';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => LoginModule),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],

  controllers: [LoginController],
  providers: [UserService, SignInUseCase],
})
export class LoginModule {}
