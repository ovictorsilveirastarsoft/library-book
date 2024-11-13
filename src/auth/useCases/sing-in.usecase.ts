import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from '../../user/dto/sign-in.dto';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async execute(data: SignInDTO) {
    const user = await this.userRepository.findOne({
      where: {
        email_user: data.name_user,
      },
    });


    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    
    const isEqualPassword = await bcrypt.compare(data.password_user, user.password_user);
    
    if (!isEqualPassword) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = {
      sub: user.id_user,
      email: user.email_user,
      name: user.name_user,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'default_secret_key',
      expiresIn: '1h',
    });

    return {
      access_token: token,
    };
  }
}
