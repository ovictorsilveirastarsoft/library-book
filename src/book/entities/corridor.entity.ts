import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Library } from '../../library/library.entity';
import { Category } from '../../categories/entities/categories.entity';
// Relacionamento com a biblioteca

@Entity('tab_corridor')
export class Corridor {
  @PrimaryGeneratedColumn()
  id_corridor: number;

  @ManyToOne(() => Category, (category) => category.id_category)
  category: Category; // Cada corredor tem uma categoria

  @Column()
  location: string; // Localização do corredor (ex: Corredor A, Corredor B)

  @OneToMany(() => Library, (library) => library.corridor)
  library: Library[]; // Relacionamento com a biblioteca
}
