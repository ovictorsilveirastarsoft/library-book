import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Library } from '../../library/library.entity';

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password_user && !this.password_user.startsWith('$2a$')) { 
      const salt = await bcrypt.genSalt(10);
      this.password_user = await bcrypt.hash(this.password_user, salt);
    }
  }

  @OneToMany(() => Library, (library) => library.user)
  libraries: Library[];
}
