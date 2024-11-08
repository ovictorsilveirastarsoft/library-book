import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Library } from 'src/library/library.entity';
@Entity('tab_user')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column()
  name_user: string;

  @Column()
  email_user: string;

  @Column()
  password_user: string;

  // Usando o decorador BeforeInsert para hashear a senha antes de salvar
  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt(10); // Gera o salt para a senha
    this.password_user = await bcrypt.hash(this.password_user, salt); // Cria o hash da senha
  }

  @OneToMany(() => Library, (library) => library.user)
  libraries: Library[];
}
