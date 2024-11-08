import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Library } from 'src/library/library.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Corridor } from './entities/corridor.entity';
import { Category } from 'src/categories/entities/categories.entity';

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
    private corridorRepository: Repository<Corridor>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { id_category, title, author, year_publication } = createBookDto;

    // 1. Verifica se a categoria existe (certificando-se de que estamos obtendo uma instância completa da categoria)
    const category = await this.categoryRepository.findOne({
      where: { id_category: id_category }, // Buscando a categoria com o id_category
    });

    if (!category) {
      throw new Error(
        'Categoria não encontrada. Solicite para um administrador criar a categoria.',
      );
    }

    console.log('Categoria encontrada:', category); // Adicionei para depuração

    // 2. Verifica se o livro já existe na biblioteca com base no título
    const existingBook = await this.bookRepository.findOne({
      where: { title }, // Verifica se o título já está na biblioteca
    });

    if (existingBook) {
      throw new Error('Este livro já existe na biblioteca.');
    }

    // 3. Verifica se o corredor existe para a categoria
    let corridor = await this.corridorRepository.findOne({
      where: { category: category },
    });

    // Se o corredor não existir, cria um novo corredor
    if (!corridor) {
      corridor = this.corridorRepository.create({
        category: category, // Relaciona a categoria com o corredor
        location: 'Localização padrão', // Pode ser uma localização dinâmica
      });
      await this.corridorRepository.save(corridor);
    }

    // 4. Cria o livro e associa à categoria corretamente
    const book = this.bookRepository.create({
      title,
      author,
      year_publication,
      category, // Passando a instância da categoria válida, não só o id
    });

    // 5. Salva o livro na tabela de livros (tab_book)
    const savedBook = await this.bookRepository.save(book);

    // 6. Cria a entrada na tabela de Library
    const library = this.libraryRepository.create({
      book: savedBook, // Relaciona o livro pelo id_book
      corridor,
      user: null, // Inicialmente, o livro não está associado a um usuário
    });

    await this.libraryRepository.save(library);

    return savedBook;
  }

  // Buscar todos os livros
  async findAll(): Promise<Book[]> {
    const books = await this.bookRepository.find({
      relations: ['category', 'library'],
    });

    if (books.length === 0) {
      throw new Error('Biblioteca vazia. Adicione um novo livro.');
    }

    return books;
  }

  // Buscar um livro por ID
  async findOne(id_book: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id_book },
      relations: ['category', 'library'],
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    }

    return book;
  }

  async update(id_book: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const { id_category } = updateBookDto;

    // 1. Verifica se o livro existe
    const book = await this.bookRepository.findOne({
      where: { id_book },
      relations: ['category', 'library'],
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    }

    // 2. Verifica se a categoria existe, caso o id_category seja fornecido
    let category = book.category;
    if (id_category) {
      category = await this.categoryRepository.findOne({
        where: { id_category },
      });

      if (!category) {
        throw new Error(
          'Categoria não encontrada. Solicite para um administrador criar a categoria.',
        );
      }
    }

    book.title = updateBookDto.title ?? book.title;
    book.author = updateBookDto.author ?? book.author;
    book.year_publication =
      updateBookDto.year_publication ?? book.year_publication;
    if (id_category) {
      book.category = category;
    }

    return await this.bookRepository.save(book);
  }
  async remove(id_book: number): Promise<void> {
    const book = await this.bookRepository.findOne({
      where: { id_book },
      relations: ['library'],
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    } else {
      console.log('Livro excluido com sucesso');
      await this.libraryRepository.delete({ book: { id_book } });
      await this.bookRepository.delete(id_book);
    }
  }
}
