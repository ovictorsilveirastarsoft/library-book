import { Library } from 'src/library/library.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('tab_book')
export class Book {
  @PrimaryGeneratedColumn()
  id_book: number;

  @Column()
  Name_book: string;

  @Column()
  Category: string;

  @Column()
  Title: string;

  @Column()
  Author: string;

  @Column()
  Year_publication: number;

  @OneToMany(() => Library, (library) => library.book)
  libraries: Library[];
}
