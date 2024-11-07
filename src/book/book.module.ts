import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importa o TypeOrmModule
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity'; // Sua entidade Book
import { Category } from './entities/categories.entity'; // Sua entidade Category
import { Library } from 'src/library/library.entity'; // Sua entidade Library
import { Corridor } from './entities/corridor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, Category, Library, Corridor]), // Registra os repositórios
  ],
  providers: [BookService], // Registra o serviço BookService
  controllers: [BookController], // Registra o controlador
})
export class BookModule {}
