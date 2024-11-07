import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity('tab_categories')
export class Category {
  @PrimaryGeneratedColumn()
  Id_category: number;

  @Column()
  Type_category: string;

  @OneToMany(() => Book, (book) => book.Category)
  books: Book[];
}
