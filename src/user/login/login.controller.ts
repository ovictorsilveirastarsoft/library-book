import { Body, Controller, Post } from '@nestjs/common';
import { SignInDTO } from '../dto/sign-in.dto';
import { SignInUseCase } from '../../auth/useCases/sing-in.usecase';

@Controller('/auth')
export class LoginController {
  constructor(private singInUseCase: SignInUseCase) {}

  @Post('/login')
  async login(@Body() loginDto: SignInDTO) {
    
    const token = await this.singInUseCase.execute(loginDto);
    return token;
  }
}
