import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { Library } from './library.entity';
import { Book } from '../book/entities/book.entity';
import { Corridor } from '../book/entities/corridor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Book, Corridor])],
  providers: [LibraryService],
  controllers: [LibraryController],
})
export class LibraryModule {}
