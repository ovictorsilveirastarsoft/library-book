import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProducerService } from 'src/kafka/producer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly producerService: ProducerService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name_user, email_user, password_user, super_user } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email_user },
    });
    if (existingUser) {
      throw new Error('Email já existe');
    }

    const hashedPassword = await bcrypt.hash(password_user, 10);
    const user = this.userRepository.create({
      name_user,
      email_user,
      password_user: hashedPassword,
      super_user: super_user,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    await this.producerService.produce(
      { topic: 'users',
         messages: [
          { 
            value: 'Todos os usuarios encontrados!' 
          }
        ] 
      });
    const users = await this.userRepository.find(); 

    if (users.length === 0) {
      throw new NotFoundException('Usuários não encontrados');
    }
        return this.userRepository.find();
  }

  async findOneById(id_user: number): Promise<User> {
    
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return this.userRepository.findOne({ where: { id_user } });
  }

  async deleteUser(id_user: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.userRepository.delete(id_user);
    throw new HttpException('Usuário deletado com sucesso!', HttpStatus.OK);
  }

  async update(id_user: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    if (updateUserDto.password_user) {
      updateUserDto.password_user = await bcrypt.hash(
        updateUserDto.password_user,
        10,
      );
    }

    await this.userRepository.update(id_user, updateUserDto);

    return this.userRepository.findOne({ where: { id_user } });
  }
}
