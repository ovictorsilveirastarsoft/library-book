import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Library } from 'src/library/library.entity';

@Entity('tab_corridor')
export class Corridor {
  @PrimaryGeneratedColumn()
  id_corridor: number;

  @Column()
  Category: string;

  @Column()
  Location: string;

  @ManyToOne(() => Book, (book) => book.libraries)
  @JoinColumn({ name: 'id_book' })
  book: Book;

  @OneToMany(() => Library, (library) => library.corridor)
  libraries: Library[];
}
