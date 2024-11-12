import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Library } from '../../library/library.entity'; // Relacionamento com a biblioteca (corredor)
import { Category } from '../../categories/entities/categories.entity';

@Entity('tab_book')
export class Book {
  @PrimaryGeneratedColumn()
  id_book: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  year_publication: number;

  @ManyToOne(() => Category, (category) => category.book)
  @JoinColumn({ name: 'id_category' })
  category: Category;

  @ManyToOne(() => Library, (library) => library.book, { onDelete: 'CASCADE' })
  library: Library;
}
