import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './book.entity';

@Entity('tab_categories')
export class Category {
  @PrimaryGeneratedColumn()
  id_category: number;

  @Column()
  type_category: string;

  @OneToMany(() => Book, (book) => book.category)
  book: Book[];
}
