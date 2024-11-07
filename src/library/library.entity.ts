import { Book } from 'src/book/entities/book.entity';
import { Corridor } from 'src/book/entities/corridor.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('tab_library')
export class Library {
  @PrimaryGeneratedColumn()
  id_library: number;

  @ManyToOne(() => Book, (book) => book.library)
  @JoinColumn({ name: 'id_book' })
  book: Book;

  @ManyToOne(() => Corridor, (corridor) => corridor.library)
  @JoinColumn({ name: 'id_corridor' })
  corridor: Corridor;

  @ManyToOne(() => User, (user) => user.libraries)
  @JoinColumn({ name: 'id_user' })
  user: User;
}
