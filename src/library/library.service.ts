import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './library.entity'; // Importando a entidade Library
import { Book } from '../book/entities/book.entity';
import { Corridor } from '../book/entities/corridor.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Corridor)
    private corridorRepository: Repository<Corridor>,
  ) {}

  async create(id_book: number, id_corridor: number): Promise<Library> {
    const book = await this.bookRepository.findOne({
      where: { id_book }, 
    });
    if (!book) {
      throw new Error('Livro não encontrado');
    }

    const corridor = await this.corridorRepository.findOne({
      where: { id_corridor },
    });
    if (!corridor) {
      throw new Error('Corredor não encontrado');
    }

  
    const library = this.libraryRepository.create({
      book, 
      corridor, 
      user: null,
    });

    return this.libraryRepository.save(library);
  }
  async findAll(): Promise<Library[]> {
    return this.libraryRepository.find({
      relations: ['book', 'corridor'], 
    });
  }
}
