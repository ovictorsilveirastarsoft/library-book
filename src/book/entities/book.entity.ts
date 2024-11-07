import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Library } from 'src/library/library.entity'; // Relacionamento com a biblioteca (corredor)
import { Category } from './categories.entity';

@Entity('Tab_book')
export class Book {
  @PrimaryGeneratedColumn()
  id_book: number;

  @Column()
  name_book: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  year_publication: number;

  @ManyToOne(() => Category, (category) => category.book)
  category: Category;

  @ManyToOne(() => Library, (library) => library.book)
  library: Library;
}
