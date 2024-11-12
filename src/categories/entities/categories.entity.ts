import { Book } from '../../book/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('tab_categories')
export class Category {
  @PrimaryGeneratedColumn()
  id_category: number;

  @Column()
  type_category: string;

  @OneToMany(() => Book, (book) => book.category)
  book: Book[];
}
