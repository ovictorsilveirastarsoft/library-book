import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './library.entity'; // Importando a entidade Library
import { Book } from 'src/book/entities/book.entity';
import { Corridor } from 'src/book/entities/corridor.entity';

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

  // Método para criar uma entrada de livro na biblioteca
  async create(id_book: number, id_corridor: number): Promise<Library> {
    // Verificar se o livro existe
    const book = await this.bookRepository.findOne({
      where: { id_book }, // Busca pelo id_book de forma correta
    });
    if (!book) {
      throw new Error('Livro não encontrado');
    }

    // Verificar se o corredor existe
    const corridor = await this.corridorRepository.findOne({
      where: { id_corridor }, // Busca pelo id_corridor de forma correta
    });
    if (!corridor) {
      throw new Error('Corredor não encontrado');
    }

    // Criar a entrada na biblioteca
    const library = this.libraryRepository.create({
      book, // Relaciona o livro
      corridor, // Relaciona o corredor
      user: null, // Inicialmente, o livro não está associado a nenhum usuário
    });

    // Salva a entrada na biblioteca
    return this.libraryRepository.save(library);
  }

  // Outros métodos, como buscar entradas da biblioteca, podem ser adicionados aqui
  async findAll(): Promise<Library[]> {
    return this.libraryRepository.find({
      relations: ['book', 'corridor'], // Inclui livro e corredor relacionados
    });
  }
}
