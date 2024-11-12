import { Body, Controller, Post } from '@nestjs/common';
import { SingInDTO } from '../dto/sign-in.dto';
import { SignInUseCase } from 'src/auth/useCases/sing-in.usecase';

@Controller('/auth')
export class LoginController {
  constructor(private singInUseCase: SignInUseCase) {}

  @Post('/login')
  async login(@Body() loginDto: SingInDTO) {
    
    const token = await this.singInUseCase.execute(loginDto);
    return token;
  }
}
