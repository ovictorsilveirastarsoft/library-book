import {
  Delete,
  ForbiddenException,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/categories.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post()
  async create(createCategoryDto: CreateCategoryDto ): Promise<Category> {
    const superUser = await this.userRepository.findOne({
      where: { super_user: true },
    });

    if (!superUser) {
      throw new ForbiddenException('Somente superusuários podem criar categorias');
    }
    const existingCategory = await this.categoryRepository.findOne({
      where: { type_category: createCategoryDto.type_category },
    });

    if (existingCategory) {
      throw new Error('Categoria já existe');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    console.log('Categoria criada:', category);
    return await this.categoryRepository.save(category);
  }

  @Get()
  async findAll(): Promise<Category[] | { message: string }> {
    const categories = await this.categoryRepository.find();

    if (categories.length === 0) {
      throw new Error('Nenhuma categoria encontrada');
    }

    return categories;
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id_category: id },
    });

    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }

    await this.categoryRepository.remove(category);
    return { message: 'Categoria deletada com sucesso.' };
  }
}
