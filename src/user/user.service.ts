import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name_user, email_user, password_user } = createUserDto;

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
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(id_user: number): Promise<User> {
    return this.userRepository.findOne({ where: { id_user } });
  }

  async deleteUser(id_user: number): Promise<void> {
    await this.userRepository.delete(id_user);
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

  async remove(id_user: number): Promise<void> {
    await this.userRepository.delete(id_user);
  }
}
