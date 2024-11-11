import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SingInDTO } from 'src/user/dto/sign-in.dto';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async execute(data: SingInDTO) {
    console.log('data', data);
    // validate user
    const user = await this.userRepository.findOne({
      where: {
        email_user: data.name_user,
      },
      select: ['password_user', 'id_user', 'email_user', 'name_user'],
    });

    // nao - retornar erro
    if (!user) {
      throw new UnauthorizedException();
    }

    // sim - valida senha
    const isEqualPassword = await compare(
      data.password_user,
      user.password_user,
    );

    if (!isEqualPassword) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id_user,
      email: user.email_user,
      name: user.name_user,
    };
    console.log('payload', payload);

    const token = await this.jwtService.signAsync(payload);

    //sim - gerar token
    return {
      access_token: token,
    };
  }
}
