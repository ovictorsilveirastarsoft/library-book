import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Library } from 'src/library/library.entity'; // Importando a entidade Library
import { CreateBookDto } from './dto/create-book.dto'; // DTO de criação de livro
import { Category } from './entities/categories.entity';
import { Corridor } from './entities/corridor.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,

    @InjectRepository(Corridor)
    private corridorRepository: Repository<Corridor>, // Repositório para corredores
  ) {}

  // Método para criar um livro e associá-lo a uma categoria e corredor
  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { type_category, title, author, year_publication } = createBookDto;

    // 1. Verifica se a categoria existe
    const category = await this.categoryRepository.findOne({
      where: { type_category }, // Buscar pela chave primária da categoria
    });

    if (!category) {
      throw new Error('Categoria não encontrada');
    }

    // 2. Verifica se o corredor para a categoria existe
    let corridor = await this.corridorRepository.findOne({
      where: { category: category }, // Filtra pelo campo 'category'
    });

    // Se não encontrar o corredor, cria um novo corredor para a categoria
    if (!corridor) {
      // Criar um novo corredor para esta categoria
      corridor = this.corridorRepository.create({
        category: category, // Associando a categoria ao corredor
        location: 'Nova Localização', // Defina uma localização padrão ou dinâmica, se necessário
      });
      await this.corridorRepository.save(corridor); // Salva o corredor
    }

    // 3. Cria o livro e associa à categoria
    const book = this.bookRepository.create({
      title,
      author,
      year_publication,
      category, // Associa a categoria ao livro
    });

    // 4. Cria a entrada na tabela de Library para associar o livro ao corredor (e sua localização)
    const library = this.libraryRepository.create({
      book, // Relacionando o livro
      corridor, // Relacionando ao corredor correto
      user: null, // Inicialmente, o livro não está associado a nenhum usuário
    });

    // 5. Salva a entrada na biblioteca
    await this.libraryRepository.save(library);

    // 6. Salva o livro na tabela de livros
    return this.bookRepository.save(book);
  }

  // Outros métodos para buscar, atualizar, remover livros
  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['category', 'library'] }); // Inclui categoria e biblioteca
  }

  async findOne(id_book: number): Promise<Book> {
    return this.bookRepository.findOne({
      where: { id_book },
      relations: ['category', 'library'],
    });
  }

  async update(id_book: number, updateBookDto: any): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id_book },
      relations: ['category', 'library'],
    });
    if (!book) {
      throw new Error('Livro não encontrado');
    }
    return this.bookRepository.save({ ...book, ...updateBookDto });
  }

  async remove(id_book: number): Promise<void> {
    await this.bookRepository.delete(id_book);
  }
}
